// Browser-only PDF: opens the print dialog for a plain-text document (save as PDF).
export function printDoc(title: string, lines: string[]) {
  const frame = document.createElement('iframe'); frame.style.position = 'fixed'; frame.style.width = '0'; frame.style.height = '0'; frame.style.border = '0';
  document.body.appendChild(frame); const doc = frame.contentDocument; if (!doc) return;
  const h = doc.createElement('h1'); h.textContent = title; doc.body.appendChild(h);
  lines.forEach(l => { const p = doc.createElement('p'); p.textContent = l; doc.body.appendChild(p); });
  doc.body.style.fontFamily = 'sans-serif';
  frame.contentWindow?.focus(); frame.contentWindow?.print(); setTimeout(() => frame.remove(), 1000);
}
