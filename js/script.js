import { AudioPlayer } from "./audioFormat.js";
import { ImageViewer } from "./imageFormat.js";
import { streamChat, generateImage, generateSpeech, errorMessage } from "./puterConfig.js";
import { Capability, hasCapability } from "./modelConfig.ts";
import { createModelPicker } from "./modelPicker.js";
import {
  renderMessage, createStreamingMessage, createMediaMessage, addTextActions,
  clearThread, setEmpty, removeMessageElement, refreshRegenerateButtons, scrollToBottom
} from "./chatView.js";
import { load, save } from "./store.js";

// ---------- Elements ----------
const app = document.querySelector(".app");
const promptInput = document.getElementById("prompt-input");
const submitBtn = document.getElementById("submit-btn");
const stopBtn = document.getElementById("stop-btn");
const micBtn = document.getElementById("mic-btn");
const modeButtons = document.querySelectorAll(".mode-btn");
const composerHint = document.getElementById("composer-hint");
const currentModelBtn = document.getElementById("current-model");
const currentModelName = document.getElementById("current-model-name");
const newChatBtn = document.getElementById("new-chat-btn");
const clearChatBtn = document.getElementById("clear-chat-btn");
const themeToggle = document.getElementById("theme-toggle");
const sidebarToggles = document.querySelectorAll("[data-sidebar-toggle]");
const backdrop = document.getElementById("sidebar-backdrop");
const toast = document.getElementById("toast");

// ---------- State ----------
const MODES = {
  chat: { placeholder: "Message the model…", hint: "Enter to send · Shift+Enter for a new line" },
  image: { placeholder: "Describe the image you want to generate…", hint: "Uses the selected model if it supports images, otherwise Puter's default" },
  speech: { placeholder: "Type text to convert to speech…", hint: "Text is read aloud with Puter's text-to-speech" },
};

const state = {
  messages: load("messages", []),
  mode: MODES[load("mode", "chat")] ? load("mode", "chat") : "chat",
  busy: null, // "chat" | "image" | "speech" while a request is running
  stopRequested: false,
  session: 0, // bumped on "new chat" so late responses from an old chat are dropped
};

const newId = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);

// Only chat text survives a reload; media URLs are short-lived blobs
function persist() {
  const durable = state.messages.filter(m => m.type === "text" && m.role !== "error" && m.mode === "chat");
  save("messages", durable);
}

// The LLM only sees chat-mode text turns
function chatHistory() {
  return state.messages
    .filter(m => m.mode === "chat" && m.type === "text" && (m.role === "user" || m.role === "assistant"))
    .map(({ role, content }) => ({ role, content }));
}

function lastAssistantId() {
  return [...state.messages].reverse().find(m => m.role === "assistant" && m.type === "text")?.id ?? null;
}

// ---------- Model picker ----------
const picker = createModelPicker({
  onSelect(model) {
    updateCurrentModel(model);
    hideToast();
    if (window.matchMedia("(max-width: 860px)").matches) setSidebar(false);
    promptInput.focus();
  },
});

function updateCurrentModel(model) {
  currentModelName.textContent = model ? model.name : "Select a model";
  currentModelBtn.classList.toggle("is-empty", !model);
  currentModelBtn.title = model ? model.id : "Choose a model";
}

updateCurrentModel(picker.selected);

// ---------- Sidebar ----------
const mobileQuery = window.matchMedia("(max-width: 860px)");

function setSidebar(open) {
  app.classList.toggle("sidebar-open", open);
  app.classList.toggle("sidebar-collapsed", !open);
  sidebarToggles.forEach(btn => btn.setAttribute("aria-expanded", String(open)));
  if (!mobileQuery.matches) save("sidebarOpen", open);
}

function isSidebarOpen() {
  return app.classList.contains("sidebar-open");
}

sidebarToggles.forEach(btn => btn.addEventListener("click", () => setSidebar(!isSidebarOpen())));
backdrop.addEventListener("click", () => setSidebar(false));
currentModelBtn.addEventListener("click", () => {
  setSidebar(true);
  picker.focusSearch();
});

// Drawer is closed by default on small screens, remembered on large ones
function syncSidebarToViewport() {
  setSidebar(mobileQuery.matches ? false : load("sidebarOpen", true));
}
mobileQuery.addEventListener("change", syncSidebarToViewport);
syncSidebarToViewport();

// ---------- Theme ----------
function currentTheme() {
  return document.documentElement.getAttribute("data-theme")
    || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

applyTheme(load("theme", null) ?? currentTheme());

themeToggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  save("theme", next);
});

// ---------- Composer ----------
function autosize() {
  promptInput.style.height = "auto";
  promptInput.style.height = Math.min(promptInput.scrollHeight, 220) + "px";
}

function updateComposer() {
  const hasText = promptInput.value.trim().length > 0;
  const canStop = state.busy === "chat";
  submitBtn.disabled = !hasText || !!state.busy;
  submitBtn.hidden = canStop;
  stopBtn.hidden = !canStop;
  app.classList.toggle("is-busy", !!state.busy);
}

function setMode(mode) {
  state.mode = mode;
  save("mode", mode);
  modeButtons.forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.mode === mode)));
  promptInput.placeholder = MODES[mode].placeholder;
  composerHint.textContent = MODES[mode].hint;
  updateComposer();
}

modeButtons.forEach(btn => btn.addEventListener("click", () => {
  setMode(btn.dataset.mode);
  promptInput.focus();
}));

promptInput.addEventListener("input", () => {
  autosize();
  updateComposer();
});

promptInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    send();
  }
});

submitBtn.addEventListener("click", send);
stopBtn.addEventListener("click", () => {
  state.stopRequested = true;
});

// Suggestion cards in the empty state
document.querySelectorAll("[data-suggestion]").forEach(card => {
  card.addEventListener("click", () => {
    setMode(card.dataset.mode || "chat");
    promptInput.value = card.dataset.suggestion;
    autosize();
    updateComposer();
    promptInput.focus();
  });
});

// ---------- Voice dictation (Web Speech API, where supported) ----------
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Recognition) {
  const recognition = new Recognition();
  recognition.lang = navigator.language || "en-US";
  recognition.interimResults = true;
  recognition.continuous = false;
  let baseText = "";
  let listening = false;

  recognition.onresult = event => {
    const transcript = [...event.results].map(r => r[0].transcript).join("");
    promptInput.value = (baseText ? baseText + " " : "") + transcript;
    autosize();
    updateComposer();
  };
  recognition.onend = () => {
    listening = false;
    micBtn.classList.remove("is-recording");
    micBtn.setAttribute("aria-pressed", "false");
  };
  recognition.onerror = event => {
    if (event.error === "not-allowed") showToast("Microphone access was denied.");
  };

  micBtn.addEventListener("click", () => {
    if (listening) {
      recognition.stop();
      return;
    }
    baseText = promptInput.value.trim();
    recognition.start();
    listening = true;
    micBtn.classList.add("is-recording");
    micBtn.setAttribute("aria-pressed", "true");
  });
} else {
  micBtn.hidden = true;
}

// ---------- Toast ----------
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 3200);
}

function hideToast() {
  clearTimeout(toastTimer);
  toast.hidden = true;
}

// ---------- Messages ----------
function addMessage(message, handlers) {
  state.messages.push(message);
  persist();
  return renderMessage(message, handlers);
}

function showError(text, onRetry) {
  const message = { id: newId(), role: "error", type: "text", mode: state.mode, content: text };
  state.messages.push(message);
  renderMessage(message, {
    onRetry: onRetry && (() => {
      removeMessage(message.id);
      onRetry();
    }),
  });
}

function removeMessage(id) {
  state.messages = state.messages.filter(m => m.id !== id);
  removeMessageElement(id);
  persist();
}

function setBusy(kind) {
  state.busy = kind;
  state.stopRequested = false;
  updateComposer();
}

function send() {
  const prompt = promptInput.value.trim();
  if (!prompt || state.busy) return;

  const model = picker.selected;
  if (state.mode === "chat" && !model) {
    showToast("Choose a model from the sidebar first.");
    setSidebar(true);
    picker.focusSearch();
    return;
  }

  promptInput.value = "";
  autosize();

  const mode = state.mode;
  addMessage({ id: newId(), role: "user", type: "text", mode, content: prompt });

  if (mode === "chat") runChat(model);
  else if (mode === "image") runImage(prompt, model);
  else runSpeech(prompt);
}

async function runChat(model) {
  setBusy("chat");
  const session = state.session;
  const stream = createStreamingMessage(model.name);
  let content = "";

  try {
    const response = await streamChat(chatHistory(), model.id);

    for await (const part of response) {
      if (state.stopRequested || session !== state.session) break;
      if (typeof part?.text === "string" && (!part.type || part.type === "text")) {
        content += part.text;
        stream.update(content);
      }
    }

    if (session !== state.session) return;

    if (!content) {
      stream.article.remove();
      if (!state.stopRequested) showError("The model returned an empty response.", () => runChat(model));
      return;
    }

    if (state.stopRequested) content += "\n\n*— stopped —*";
    stream.update(content);
    stream.finish();

    const message = { id: newId(), role: "assistant", type: "text", mode: "chat", content, modelName: model.name };
    stream.article.dataset.id = message.id;
    addTextActions(stream.actions, content, regenerate);
    state.messages.push(message);
    persist();
    refreshRegenerateButtons(lastAssistantId());
  } catch (error) {
    console.error("Error getting LLM response:", error);
    stream.article.remove();
    if (session !== state.session) return;
    showError(errorMessage(error), () => runChat(model));
  } finally {
    if (session === state.session) setBusy(null);
  }
}

function regenerate() {
  if (state.busy) return;
  const model = picker.selected;
  if (!model) {
    showToast("Choose a model from the sidebar first.");
    return;
  }
  const lastId = lastAssistantId();
  const last = state.messages[state.messages.length - 1];
  if (lastId && last?.id === lastId) removeMessage(lastId);
  runChat(model);
}

function mediaTheme() {
  return currentTheme() === "dark" ? "dark" : "light";
}

async function runImage(prompt, model) {
  setBusy("image");
  const session = state.session;
  const imageModel = model && hasCapability(model.id, Capability.Image) ? model : null;
  const media = createMediaMessage(imageModel?.name ?? "Image", "Generating image…");

  try {
    let image;
    let subtitle = imageModel ? imageModel.id : "Puter default image model";
    try {
      image = await generateImage(prompt, imageModel?.id);
    } catch (error) {
      if (!imageModel) throw error;
      // Fall back to the default model if this one isn't available on Puter
      console.warn(`Image model ${imageModel.id} failed, using default:`, error);
      image = await generateImage(prompt);
      subtitle = `Default model (${imageModel.name} unavailable)`;
    }

    if (session !== state.session) return;
    media.ready();
    new ImageViewer(image.src, media.body, { title: prompt, subtitle, theme: mediaTheme(), showShare: false });
    state.messages.push({ id: newId(), role: "assistant", type: "image", mode: "image", content: prompt });
    scrollToBottom();
  } catch (error) {
    console.error("Error generating image:", error);
    media.article.remove();
    if (session !== state.session) return;
    showError(errorMessage(error), () => runImage(prompt, model));
  } finally {
    if (session === state.session) setBusy(null);
  }
}

async function runSpeech(text) {
  setBusy("speech");
  const session = state.session;
  const media = createMediaMessage("Speech", "Generating audio…");

  try {
    const audio = await generateSpeech(text);
    if (session !== state.session) return;
    media.ready();
    new AudioPlayer(audio.src, media.body, {
      title: text.length > 60 ? text.slice(0, 57) + "…" : text,
      subtitle: "Text to speech",
      theme: mediaTheme(),
      showDownload: true,
      showShare: false,
      showTranscript: false,
    });
    state.messages.push({ id: newId(), role: "assistant", type: "audio", mode: "speech", content: text });
    scrollToBottom();
  } catch (error) {
    console.error("Error generating speech:", error);
    media.article.remove();
    if (session !== state.session) return;
    showError(errorMessage(error), () => runSpeech(text));
  } finally {
    if (session === state.session) setBusy(null);
  }
}

// ---------- New / clear chat ----------
function newChat() {
  state.session++;
  setBusy(null);
  state.messages = [];
  persist();
  clearThread();
  promptInput.focus();
  if (mobileQuery.matches) setSidebar(false);
}

newChatBtn.addEventListener("click", newChat);
clearChatBtn.addEventListener("click", () => {
  if (state.messages.length && confirm("Clear this conversation?")) newChat();
});

// ---------- Global shortcuts ----------
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && mobileQuery.matches && isSidebarOpen()) {
    setSidebar(false);
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    setSidebar(true);
    picker.focusSearch();
  }
});

// ---------- Restore previous conversation ----------
if (state.messages.length) {
  state.messages.forEach(message => renderMessage(message, { onRegenerate: regenerate }));
  refreshRegenerateButtons(lastAssistantId());
  scrollToBottom(true);
} else {
  setEmpty(true);
}

setMode(state.mode);
autosize();
