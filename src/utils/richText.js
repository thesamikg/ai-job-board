const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "blockquote",
  "div",
]);

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeTextAlign(value) {
  const match = String(value || "").match(/text-align\s*:\s*(left|center|right)/i);
  return match ? `text-align: ${match[1].toLowerCase()};` : "";
}

function sanitizeHref(href) {
  const value = String(href || "").trim();
  if (!value) return "";
  return /^(https?:|mailto:)/i.test(value) ? value : "";
}

function sanitizeNode(node, doc) {
  if (node.nodeType === Node.TEXT_NODE) {
    return doc.createTextNode(node.textContent || "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const tagName = node.nodeName.toLowerCase();
  const children = Array.from(node.childNodes).map((child) => sanitizeNode(child, doc)).filter(Boolean);

  if (!ALLOWED_TAGS.has(tagName)) {
    const fragment = doc.createDocumentFragment();
    children.forEach((child) => fragment.appendChild(child));
    return fragment;
  }

  const element = doc.createElement(tagName === "b" ? "strong" : tagName === "i" ? "em" : tagName);
  const textAlignStyle = sanitizeTextAlign(node.getAttribute("style") || "");
  const alignAttr = String(node.getAttribute("align") || "").toLowerCase();

  if (textAlignStyle) {
    element.setAttribute("style", textAlignStyle);
  } else if (["left", "center", "right"].includes(alignAttr)) {
    element.setAttribute("style", `text-align: ${alignAttr};`);
  }

  if (tagName === "a") {
    const href = sanitizeHref(node.getAttribute("href"));
    if (href) {
      element.setAttribute("href", href);
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noreferrer noopener");
    }
  }

  children.forEach((child) => element.appendChild(child));
  return element;
}

export function sanitizeRichText(input) {
  const value = String(input || "").trim();
  if (!value) return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined" || typeof document === "undefined") {
    return escapeHtml(value).replace(/\n/g, "<br />");
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${value}</div>`, "text/html");
  const wrapper = parsed.body.firstElementChild;
  const safeDoc = document.implementation.createHTMLDocument("");
  const fragment = safeDoc.createDocumentFragment();

  Array.from(wrapper?.childNodes || []).forEach((child) => {
    const sanitized = sanitizeNode(child, safeDoc);
    if (sanitized) fragment.appendChild(sanitized);
  });

  const container = safeDoc.createElement("div");
  container.appendChild(fragment);
  return container.innerHTML.trim();
}

export function extractPlainText(input) {
  const value = String(input || "").trim();
  if (!value) return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${value}</div>`, "text/html");
  return String(parsed.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function formatRichTextForDisplay(input) {
  const value = String(input || "").trim();
  if (!value) return "";

  if (!/<[a-z][\s\S]*>/i.test(value)) {
    return value
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br />")}</p>`)
      .join("");
  }

  return sanitizeRichText(value);
}
