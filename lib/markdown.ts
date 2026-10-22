import fs from "node:fs";
import path from "node:path";

export function loadArticle(): string {
  return fs.readFileSync(path.join(process.cwd(), "content", "medium-article-Cursor.md"), "utf8");
}

export function markdownToHtml(source: string): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let list: string[] | null = null;

  const flush = () => {
    if (!list) return;
    html.push(`<ul>${list.join("")}</ul>`);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      html.push(`<h2>${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      flush();
      html.push(`<h1>${inline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("- ")) {
      list = list ?? [];
      list.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    flush();
    html.push(`<p>${inline(line)}</p>`);
  }
  flush();
  return html.join("\n");
}

function inline(text: string): string {
  let value = escapeHtml(text);
  value = value.replace(/`([^`]+)`/g, "<code>$1</code>");
  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  value = value.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
  return value;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
