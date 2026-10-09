// Markdown rendering, sanitising and code-block helpers
// marked, DOMPurify and Prism are loaded globally from CDN in index.html

let markedConfigured = false;

function configureMarked() {
  if (markedConfigured || !globalThis.marked) return;
  marked.setOptions({
    mangle: false,
    headerIds: false,
    breaks: true,
    gfm: true
  });
  markedConfigured = true;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Model output is untrusted, so the generated HTML is always sanitised
export function renderMarkdown(text) {
  configureMarked();
  const html = globalThis.marked ? marked.parse(text) : escapeHtml(text).replace(/\n/g, "<br>");
  return globalThis.DOMPurify ? DOMPurify.sanitize(html) : escapeHtml(text);
}

export function copyToClipboard(text, button) {
  const label = button.querySelector(".btn-label") ?? button;
  const original = label.textContent;

  navigator.clipboard.writeText(text).then(() => {
    label.textContent = "Copied!";
    button.classList.add("is-success");
  }).catch(err => {
    console.error("Failed to copy:", err);
    label.textContent = "Failed";
  }).finally(() => {
    setTimeout(() => {
      label.textContent = original;
      button.classList.remove("is-success");
    }, 1600);
  });
}

// Wraps code blocks with a header (language + copy button) and highlights them
export function enhanceCodeBlocks(container, { highlight = true } = {}) {
  container.querySelectorAll("pre > code").forEach(codeBlock => {
    const pre = codeBlock.parentElement;
    if (pre.parentElement.classList.contains("code-block")) return;

    const lang = [...codeBlock.classList]
      .find(c => c.startsWith("language-"))?.replace("language-", "") || "text";

    const wrapper = document.createElement("div");
    wrapper.className = "code-block";

    const header = document.createElement("div");
    header.className = "code-block-header";

    const langLabel = document.createElement("span");
    langLabel.className = "code-block-lang";
    langLabel.textContent = lang;

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-button";
    copyButton.innerHTML = '<span class="btn-label">Copy</span>';
    copyButton.addEventListener("click", () => copyToClipboard(codeBlock.textContent, copyButton));

    header.append(langLabel, copyButton);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.append(header, pre);
  });

  // Autoloader fetches grammars on demand, so highlight after insertion
  if (highlight && globalThis.Prism) {
    Prism.highlightAllUnder(container);
  }
}

// Full render: markdown + code block chrome + highlighting
export function renderInto(element, text) {
  element.innerHTML = renderMarkdown(text);
  enhanceCodeBlocks(element);
}
