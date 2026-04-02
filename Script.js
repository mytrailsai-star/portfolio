const canvas =document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('gameStatus');
const mobileHelp = document.getElementById('mobileGameHelp');
const mobileButtons = document.querySelectorAll('.mobile-nodes button');

const grid = { cols: 9, rows: 5, cell: 60, margin: 20 };
const nodes = [
  { id: 'about', x: 1, y: 2, label: 'About' },
  { id: 'skills', x: 4, y: 1, label: 'Skills' },
  { id: 'projects', x: 7, y: 3, label: 'Projects'},
  { id: 'contact', x: 2, y: 4, label: 'Contact' } ];

let player = { x: 0, y: 2 };
let winNode = null;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#151d38');
  grad.addColorStop(1, '#09131f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const x = grid.margin + c * grid.cell;
      const y = grid.margin + r * grid.cell;
      ctx.strokeStyle = 'rgba(96, 136, 193, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, grid.cell, grid.cell);
    }
  }

  nodes.forEach(node => {
    const x = grid.margin + node.x * grid.cell + grid.cell / 2;
    const y = grid.margin + node.y * grid.cell + grid.cell / 2;
    ctx.beginPath();
    ctx.fillStyle = '#2f4e8b';
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#80bff8';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#d5e8ff';
    ctx.font = '600 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label[0], x, y);
  });

  const px = grid.margin + player.x * grid.cell + grid.cell / 2;
  const py = grid.margin + player.y * grid.cell + grid.cell / 2;
  ctx.beginPath();
  ctx.fillStyle = '#5cfff3';
  ctx.arc(px, py, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#20d9ff';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#012c3a';
  ctx.font = 'bold 14px JetBrains Mono, monospace';
  ctx.fillText('⌨', px, py);
}

function getClosestNode() {
  const closest = nodes.reduce((best, node) => {
    const dist = Math.hypot(player.x - node.x, player.y - node.y);
    return dist < best.dist ? { node, dist } : best;
  }, { node: null, dist: Infinity });
  return closest.node;
}

function setStatus(message) {
  if (!status) return;
  status.textContent = message;
}

function maybeTriggerNode() {
  const node = getClosestNode();
  const dist = Math.hypot(player.x - node.x, player.y - node.y);
  if (dist <= 1) {
    if (winNode !== node.id) {
      winNode = node.id;
      setStatus(`Arrived at ${node.label}. Jumping to section...`);
      document.getElementById(node.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => setStatus('Use arrows/WASD to move to other nodes.'), 1200);
    }
  }
}

function clampPos(value, max) {
  return Math.min(Math.max(value, 0), max - 1);
}

function move(dx, dy) {
  player.x = clampPos(player.x + dx, grid.cols);
  player.y = clampPos(player.y + dy, grid.rows);
  drawGrid();
  maybeTriggerNode();
}

window.addEventListener('keydown', (event) => {
  const keys = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
  const key = event.key;
  if (keys[key]) {
    event.preventDefault();
    move(...keys[key]);
  }
  if (key === 'h') {
    setStatus('Hint: Move the avatar to a node to open section.');
  }
});

mobileButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    document.getElementById(target).scrollIntoView({ behavior: 'smooth', block: 'start' });
    setStatus(`Selected ${target}.`);
  });
});

const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    feedback.textContent = 'Please complete all fields before sending.';
    feedback.style.color = '#ff9d9d';
    return;
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    feedback.textContent = 'Enter a valid email address.';
    feedback.style.color = '#ff9d9d';
    return;
  }

  feedback.textContent = 'Message submitted! I will reply soon. (SIMULATED submission)';
  feedback.style.color = '#80ff9c';
  form.reset();
});

function initialize() {
  drawGrid();
  setStatus('Arrow keys / WASD to move. Reach nodes to load content.');

  if (window.innerWidth <= 720) {
    mobileHelp.style.display = 'block';
  } else {
    mobileHelp.style.display = 'none';
  }
}

window.addEventListener('resize', initialize);
initialize();
