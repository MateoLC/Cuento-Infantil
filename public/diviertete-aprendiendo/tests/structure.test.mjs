import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = [
  ["sopa.html", "game.js"],
  ["laberinto.html", "laberinto.js"],
  ["crucigrama.html", "crucigrama.js"],
  ["colorear.html", "colorear.js"],
  ["asociar.html", "asociar.js"],
  ["memoria.html", "memoria.js"],
];

for (const [htmlFile, scriptFile] of pages) {
  const html = fs.readFileSync(path.join(root, htmlFile), "utf8");
  const script = fs.readFileSync(path.join(root, scriptFile), "utf8");
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${htmlFile} contiene IDs duplicados`);
  assert.ok(
    html.indexOf('src="chapters.js') < html.indexOf(`src="${scriptFile}`),
    `${htmlFile} debe cargar chapters.js antes de ${scriptFile}`,
  );

  const selectedIds = [...script.matchAll(/querySelector\(["']#([a-zA-Z0-9-]+)["']\)/g)]
    .map((match) => match[1]);
  for (const id of selectedIds) {
    assert.ok(ids.includes(id), `${scriptFile} busca #${id}, pero no existe en ${htmlFile}`);
  }
}

for (const page of pages.map(([htmlFile]) => htmlFile)) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  assert.ok(html.includes('href="memoria.html"'), `${page} debe incluir Memoria en la navegación`);
}

for (const asset of [
  "sopa-de-letras-frame.webp",
  "laberinto-frame.webp",
  "crucigrama-frame.webp",
  "colorear-frame.webp",
  "asociar-frame.webp",
]) {
  assert.ok(fs.existsSync(path.join(root, "assets", asset)), `Falta assets/${asset}`);
}

for (const asset of [
  "rana-dorada.webp",
  "boa.webp",
  "iguana.webp",
  "caiman.webp",
  "colibri.webp",
  "condor.webp",
  "oso-anteojos.webp",
  "jaguar.webp",
  "danta.webp",
  "manati.webp",
  "delfin-rosado.webp",
  "mono-ardilla.webp",
]) {
  assert.ok(fs.existsSync(path.join(root, "assets", "memory", asset)), `Falta assets/memory/${asset}`);
}

console.log("OK: estructura de 6 páginas, scripts, navegación, IDs y recursos.");
