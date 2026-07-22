const COLORING_STORAGE_KEY = "diviertete-colorear-biodiversidad-v1";
const SOURCE_CROP = { x: 0.08, y: 0.191, width: 0.608, height: 0.686 };
const MAX_ACTIONS = 120;

const COLORS = [
  { name: "Verde hoja", value: "#5f8d3e" },
  { name: "Verde selva", value: "#24583a" },
  { name: "Turquesa", value: "#45a9a2" },
  { name: "Azul cielo", value: "#5d9fc5" },
  { name: "Amarillo sol", value: "#edc84c" },
  { name: "Naranja", value: "#e58b3e" },
  { name: "Rosa orquídea", value: "#d87898" },
  { name: "Violeta", value: "#896aa5" },
  { name: "Rojo coral", value: "#cf5a4d" },
  { name: "Marrón tierra", value: "#8b603c" },
  { name: "Verde lima", value: "#9dbb50" },
  { name: "Azul profundo", value: "#356a91" },
];

const canvas = document.querySelector("#coloring-canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const loading = document.querySelector("#canvas-loading");
const palette = document.querySelector("#color-palette");
const feedback = document.querySelector("#color-feedback");
const progressLabel = document.querySelector("#color-progress-label");
const progressBar = document.querySelector("#color-progress-bar");
const brushSize = document.querySelector("#brush-size");

let originalImageData = null;
let actions = [];
let selectedColor = COLORS[0].value;
let activeTool = "fill";
let activeStroke = null;
let ready = false;

function hexToRgb(hex) {
  return {
    red: Number.parseInt(hex.slice(1, 3), 16),
    green: Number.parseInt(hex.slice(3, 5), 16),
    blue: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function luminance(data, index) {
  return data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
}

function loadActions() {
  try {
    const stored = JSON.parse(localStorage.getItem(COLORING_STORAGE_KEY));
    return Array.isArray(stored) ? stored.slice(-MAX_ACTIONS) : [];
  } catch {
    return [];
  }
}

function saveActions() {
  localStorage.setItem(COLORING_STORAGE_KEY, JSON.stringify(actions.slice(-MAX_ACTIONS)));
}

function updateProgress() {
  const usedColors = new Set(actions.filter((action) => action.tool !== "eraser").map((action) => action.color));
  const count = usedColors.size;
  progressLabel.textContent = count ? `${count} ${count === 1 ? "color usado" : "colores usados"}` : "Elige tu primer color";
  progressBar.style.width = `${Math.min(100, Math.round((count / 8) * 100))}%`;
  document.querySelector("#color-undo").disabled = !actions.length;
}

function setTool(tool) {
  activeTool = tool;
  document.querySelectorAll(".tool-modes button").forEach((button) => {
    const active = button.dataset.tool === tool;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  canvas.style.cursor = tool === "fill" ? "crosshair" : tool === "eraser" ? "cell" : "crosshair";
  feedback.textContent = tool === "fill"
    ? "Toca una zona cerrada para llenarla de color."
    : tool === "brush"
      ? "Dibuja sobre el papel sin perder los contornos."
      : "Pasa sobre el color que quieras retirar.";
}

function renderPalette() {
  COLORS.forEach((color, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `color-swatch${index === 0 ? " is-active" : ""}`;
    button.style.setProperty("--swatch", color.value);
    button.dataset.color = color.value;
    button.setAttribute("aria-label", color.name);
    button.title = color.name;
    button.addEventListener("click", () => {
      selectedColor = color.value;
      document.querySelectorAll(".color-swatch").forEach((swatch) => swatch.classList.toggle("is-active", swatch === button));
      if (activeTool === "eraser") setTool("brush");
      feedback.textContent = `${color.name} seleccionado.`;
    });
    palette.append(button);
  });
}

function getCanvasPoint(event) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(canvas.width - 1, Math.round((event.clientX - bounds.left) * canvas.width / bounds.width))),
    y: Math.max(0, Math.min(canvas.height - 1, Math.round((event.clientY - bounds.top) * canvas.height / bounds.height))),
  };
}

function paintColor(data, index, color) {
  const source = originalImageData.data;
  const texture = 0.82 + (luminance(source, index) / 255) * 0.18;
  data[index] = Math.round(color.red * texture);
  data[index + 1] = Math.round(color.green * texture);
  data[index + 2] = Math.round(color.blue * texture);
  data[index + 3] = 255;
}

function floodFill(point, colorValue) {
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  const original = originalImageData.data;
  const startPixel = point.y * canvas.width + point.x;
  const startIndex = startPixel * 4;
  if (luminance(original, startIndex) < 190) return false;

  const target = [data[startIndex], data[startIndex + 1], data[startIndex + 2]];
  const selected = hexToRgb(colorValue);
  const targetDistance = Math.hypot(target[0] - selected.red, target[1] - selected.green, target[2] - selected.blue);
  if (targetDistance < 18) return false;

  const visited = new Uint8Array(canvas.width * canvas.height);
  const stack = [startPixel];
  let painted = 0;

  const matches = (pixel) => {
    if (pixel < 0 || pixel >= canvas.width * canvas.height || visited[pixel]) return false;
    const index = pixel * 4;
    if (luminance(original, index) < 190) return false;
    return Math.hypot(data[index] - target[0], data[index + 1] - target[1], data[index + 2] - target[2]) < 66;
  };

  while (stack.length) {
    const pixel = stack.pop();
    if (!matches(pixel)) continue;
    const row = Math.floor(pixel / canvas.width);
    let left = pixel;
    while (left % canvas.width > 0 && matches(left - 1)) left -= 1;

    let current = left;
    let checkingUp = false;
    let checkingDown = false;
    while (Math.floor(current / canvas.width) === row && matches(current)) {
      visited[current] = 1;
      paintColor(data, current * 4, selected);
      painted += 1;

      const up = current - canvas.width;
      const down = current + canvas.width;
      if (row > 0 && matches(up)) {
        if (!checkingUp) stack.push(up);
        checkingUp = true;
      } else checkingUp = false;
      if (row < canvas.height - 1 && matches(down)) {
        if (!checkingDown) stack.push(down);
        checkingDown = true;
      } else checkingDown = false;
      current += 1;
    }
  }

  if (painted < 12) return false;
  context.putImageData(image, 0, 0);
  return true;
}

function applyBrushAction(action) {
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  const original = originalImageData.data;
  const color = hexToRgb(action.color);
  const radius = Math.max(2, action.size / 2);

  const paintPoint = (point) => {
    const minX = Math.max(0, Math.floor(point.x - radius));
    const maxX = Math.min(canvas.width - 1, Math.ceil(point.x + radius));
    const minY = Math.max(0, Math.floor(point.y - radius));
    const maxY = Math.min(canvas.height - 1, Math.ceil(point.y + radius));
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        if (Math.hypot(x - point.x, y - point.y) > radius) continue;
        const index = (y * canvas.width + x) * 4;
        if (action.tool === "eraser") {
          data[index] = original[index];
          data[index + 1] = original[index + 1];
          data[index + 2] = original[index + 2];
          data[index + 3] = original[index + 3];
        } else if (luminance(original, index) >= 185) {
          paintColor(data, index, color);
        }
      }
    }
  };

  action.points.forEach((point, index) => {
    if (!index) {
      paintPoint(point);
      return;
    }
    const previous = action.points[index - 1];
    const distance = Math.hypot(point.x - previous.x, point.y - previous.y);
    const steps = Math.max(1, Math.ceil(distance / Math.max(2, radius * 0.45)));
    for (let step = 1; step <= steps; step += 1) {
      paintPoint({
        x: previous.x + (point.x - previous.x) * step / steps,
        y: previous.y + (point.y - previous.y) * step / steps,
      });
    }
  });
  context.putImageData(image, 0, 0);
}

function applyAction(action) {
  if (action.tool === "fill") floodFill(action.point, action.color);
  else applyBrushAction(action);
}

function renderActions() {
  context.putImageData(originalImageData, 0, 0);
  actions.forEach(applyAction);
  updateProgress();
}

function commitAction(action) {
  actions.push(action);
  if (actions.length > MAX_ACTIONS) actions.shift();
  saveActions();
  updateProgress();
}

function handlePointerDown(event) {
  if (!ready) return;
  event.preventDefault();
  const point = getCanvasPoint(event);
  canvas.setPointerCapture(event.pointerId);

  if (activeTool === "fill") {
    if (floodFill(point, selectedColor)) {
      commitAction({ tool: "fill", color: selectedColor, point });
      feedback.textContent = "¡Zona coloreada! Prueba otro color o continúa explorando.";
    } else feedback.textContent = "Prueba dentro de una zona clara y cerrada.";
    return;
  }

  activeStroke = {
    tool: activeTool,
    color: selectedColor,
    size: Number(brushSize.value),
    points: [point],
  };
}

function handlePointerMove(event) {
  if (!activeStroke || !canvas.hasPointerCapture(event.pointerId)) return;
  event.preventDefault();
  const point = getCanvasPoint(event);
  const previous = activeStroke.points[activeStroke.points.length - 1];
  if (Math.hypot(point.x - previous.x, point.y - previous.y) >= 4) activeStroke.points.push(point);
}

function finishStroke(event) {
  if (!activeStroke) return;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  applyBrushAction(activeStroke);
  commitAction(activeStroke);
  feedback.textContent = activeStroke.tool === "eraser" ? "Restauraste una parte del papel." : "Trazo añadido al dibujo.";
  activeStroke = null;
}

function undo() {
  if (!ready || !actions.length) return;
  actions.pop();
  saveActions();
  renderActions();
  feedback.textContent = "Deshiciste la última acción.";
}

function resetDrawing() {
  if (!ready) return;
  actions = [];
  localStorage.removeItem(COLORING_STORAGE_KEY);
  renderActions();
  feedback.textContent = "El papel está listo para una nueva combinación de colores.";
}

function saveDrawing() {
  if (!ready) return;
  const link = document.createElement("a");
  link.download = "mi-biodiversidad-coloreada.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  feedback.textContent = "Tu ilustración está lista para guardar.";
}

function initializeCanvas() {
  const image = new Image();
  image.addEventListener("load", () => {
    const sourceX = Math.round(image.naturalWidth * SOURCE_CROP.x);
    const sourceY = Math.round(image.naturalHeight * SOURCE_CROP.y);
    const sourceWidth = Math.round(image.naturalWidth * SOURCE_CROP.width);
    const sourceHeight = Math.round(image.naturalHeight * SOURCE_CROP.height);
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    actions = loadActions();
    renderActions();
    ready = true;
    loading.hidden = true;
  });
  image.addEventListener("error", () => {
    loading.textContent = "No fue posible preparar el dibujo.";
  });
  image.src = "assets/colorear-frame.webp";
}

renderPalette();
initializeCanvas();

document.querySelectorAll(".tool-modes button").forEach((button) => button.addEventListener("click", () => setTool(button.dataset.tool)));
document.querySelector("#color-undo").addEventListener("click", undo);
document.querySelector("#color-reset").addEventListener("click", resetDrawing);
document.querySelector("#color-save").addEventListener("click", saveDrawing);
canvas.addEventListener("pointerdown", handlePointerDown);
canvas.addEventListener("pointermove", handlePointerMove);
canvas.addEventListener("pointerup", finishStroke);
canvas.addEventListener("pointercancel", finishStroke);
