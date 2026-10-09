import { renderMarkdown, renderInto, enhanceCodeBlocks, copyToClipboard } from "./textFormat.js";
import { icons } from "./icons.js";

// DOM rendering for the conversation thread

const thread = document.getElementById("message-list");
const scroller = document.getElementById("response-display");
const emptyState = document.getElementById("empty-state");
const scrollBtn = document.getElementById("scroll-bottom-btn");

let stickToBottom = true;

scroller.addEventListener("scroll", () => {
    const distance = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    stickToBottom = distance < 80;
    scrollBtn.hidden = stickToBottom;
});

scrollBtn.addEventListener("click", () => scrollToBottom(true));

export function scrollToBottom(force = false) {
    if (force) stickToBottom = true;
    if (stickToBottom) {
        scroller.scrollTop = scroller.scrollHeight;
    }
}

export function setEmpty(isEmpty) {
    emptyState.hidden = !isEmpty;
    thread.hidden = isEmpty;
}

export function clearThread() {
    thread.innerHTML = "";
    setEmpty(true);
}

function actionButton(icon, label, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "msg-action";
    btn.innerHTML = `${icon}<span class="btn-label">${label}</span>`;
    btn.setAttribute("aria-label", label);
    btn.addEventListener("click", () => onClick(btn));
    return btn;
}

// Builds the outer message shell; returns the element and its body/actions slots
function createShell(role, label) {
    const article = document.createElement("article");
    article.className = `message message--${role}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = role === "user" ? icons.user : role === "error" ? icons.alert : icons.bot;

    const main = document.createElement("div");
    main.className = "message-main";

    const header = document.createElement("div");
    header.className = "message-header";
    header.textContent = label;

    const body = document.createElement("div");
    body.className = "message-content";

    const actions = document.createElement("div");
    actions.className = "message-actions";

    main.append(header, body, actions);
    article.append(avatar, main);
    return { article, body, actions };
}

export function addTextActions(actions, content, onRegenerate) {
    actions.append(actionButton(icons.copy, "Copy", btn => copyToClipboard(content, btn)));
    if (onRegenerate) {
        const btn = actionButton(icons.refresh, "Regenerate", onRegenerate);
        btn.classList.add("msg-action--regenerate");
        actions.append(btn);
    }
}

/**
 * Renders a stored message.
 * handlers: { onRegenerate, onRetry, onDelete } — optional callbacks for actions
 */
export function renderMessage(message, handlers = {}) {
    setEmpty(false);

    const label = message.role === "user"
        ? "You"
        : message.role === "error" ? "Error" : (message.modelName || "Assistant");

    const { article, body, actions } = createShell(message.role, label);
    article.dataset.id = message.id;

    if (message.role === "error") {
        body.textContent = message.content;
        if (handlers.onRetry) {
            actions.append(actionButton(icons.refresh, "Retry", handlers.onRetry));
        }
    } else if (message.role === "user") {
        body.textContent = message.content;
        actions.append(actionButton(icons.copy, "Copy", btn => copyToClipboard(message.content, btn)));
    } else if (message.type === "text") {
        renderInto(body, message.content);
        addTextActions(actions, message.content, handlers.onRegenerate);
    }

    thread.appendChild(article);
    scrollToBottom();
    return { article, body, actions };
}

// Assistant message used for streaming text in; shows typing dots until content arrives
export function createStreamingMessage(modelName) {
    setEmpty(false);
    const { article, body, actions } = createShell("assistant", modelName || "Assistant");
    article.classList.add("is-streaming");
    body.innerHTML = '<span class="typing" aria-label="Thinking"><span></span><span></span><span></span></span>';
    thread.appendChild(article);
    scrollToBottom(true);

    let pending = null;
    let latest = "";

    // Markdown rendering is throttled to one frame to keep long streams smooth
    function update(text) {
        latest = text;
        if (pending) return;
        pending = requestAnimationFrame(() => {
            pending = null;
            body.innerHTML = renderMarkdown(latest);
            enhanceCodeBlocks(body, { highlight: false });
            scrollToBottom();
        });
    }

    function finish() {
        if (pending) cancelAnimationFrame(pending);
        pending = null;
        article.classList.remove("is-streaming");
        renderInto(body, latest);
        scrollToBottom();
    }

    return { article, body, actions, update, finish };
}

// Container for media players (image / audio) inside an assistant message
export function createMediaMessage(label, statusText) {
    setEmpty(false);
    const { article, body, actions } = createShell("assistant", label);
    article.classList.add("message--media", "is-streaming");
    body.innerHTML = `<div class="media-loading"><span class="typing"><span></span><span></span><span></span></span><span>${statusText}</span></div>`;
    thread.appendChild(article);
    scrollToBottom(true);
    return {
        article,
        body,
        actions,
        ready() {
            article.classList.remove("is-streaming");
            body.innerHTML = "";
        },
    };
}

export function removeMessageElement(id) {
    thread.querySelector(`[data-id="${CSS.escape(id)}"]`)?.remove();
    if (!thread.children.length) setEmpty(true);
}

// Regenerate is only offered on the latest assistant text reply
export function refreshRegenerateButtons(lastAssistantId) {
    thread.querySelectorAll(".message--assistant").forEach(el => {
        el.classList.toggle("is-last", el.dataset.id === lastAssistantId);
    });
}
