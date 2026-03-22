const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const musica = document.getElementById("musica");
const mensaje = document.getElementById("mensaje");
const btn = document.getElementById("btn");
const contador = document.getElementById("contador");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let textoMostrado = false;

/* TEXTO */
const texto = "Eres lo mejor que me ha pasado 💛";
let i = 0;
let escribiendo = false;
mensaje.innerHTML = "";

/* ANIMACIÓN */
let flores = [];
let tiempo = 0;
let alturaTronco = 0;

/* LATIDO */
let escala = 1;
let creciendo = true;

/* ESCRIBIR TEXTO */
function escribirTexto() {
  if (escribiendo) return;
  escribiendo = true;

  function loop() {
    if (i < texto.length) {
      mensaje.innerHTML += texto.charAt(i);
      i++;
      setTimeout(loop, 50);
    }
  }

  loop();
}

/* CORAZÓN */
function heart(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
  };
}

/* CREAR FLORES */
function crearFlores() {
  flores = []; // limpia por si acaso

  for (let i = 0; i < 1000; i++) {
    let t = Math.random() * Math.PI * 2;
    let pos = heart(t);

    flores.push({
      x: canvas.width / 2,
      y: canvas.height,
      tx: canvas.width / 2 + pos.x * 15,
      ty: canvas.height / 2 - pos.y * 15,
      size: Math.random() * 3 + 2,
      alpha: 0
    });
  }
}

/* TRONCO */
function dibujarTronco() {
  if (alturaTronco < 200) {
    alturaTronco += 4;
  }

  ctx.fillStyle = "#8B4513";
  ctx.fillRect(
    canvas.width / 2 - 10,
    canvas.height - alturaTronco,
    20,
    alturaTronco
  );
}

/* ANIMACIÓN */
function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dibujarTronco();

  let completado = true;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(escala, escala);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  flores.forEach(f => {
    f.alpha += 0.04;
    ctx.globalAlpha = f.alpha;

    f.x += (f.tx - f.x) * 0.08;
    f.y += (f.ty - f.y) * 0.08;

    if (Math.abs(f.x - f.tx) > 1 || Math.abs(f.y - f.ty) > 1) {
      completado = false;
    }

    ctx.shadowBlur = 10;
    ctx.shadowColor = "yellow";

/* 🌻 pétalos más realistas */
  for (let i = 0; i < 10; i++) {
    let angle = (Math.PI * 2 * i) / 10;

    let radio = f.size * 2;

    let px = f.x + Math.cos(angle) * radio;
    let py = f.y + Math.sin(angle) * radio;

    let grad = ctx.createRadialGradient(px, py, 0, px, py, f.size * 2);
    grad.addColorStop(0, "#FFD54F");
    grad.addColorStop(1, "#FFB300");

    ctx.beginPath();
    ctx.arc(px, py, f.size, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
}

/* centro más real */
let centroGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 2);
centroGrad.addColorStop(0, "#4E342E");
centroGrad.addColorStop(1, "#2E1A12");

ctx.beginPath();
ctx.arc(f.x, f.y, f.size * 1.2, 0, Math.PI * 2);
ctx.fillStyle = centroGrad;
ctx.fill();

    /* centro */
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
    ctx.fillStyle = "#5a3d00";
    ctx.fill();

    ctx.globalAlpha = 1;
  });

  ctx.restore();

  /* LATIDO */
  if (completado) {
    if (completado && !textoMostrado) {
    textoMostrado = true;
    escribirTexto();
    mensaje.classList.add("show");
}
    if (creciendo) {
      escala += 0.002;
      if (escala > 1.05) creciendo = false;
    } else {
      escala -= 0.002;
      if (escala < 1) creciendo = true;
    }
  }

  requestAnimationFrame(animar);
}

/* BOTÓN */
btn.addEventListener("click", () => {
  btn.style.display = "none";

  /* 🎵 MÚSICA (CONFIGURADA) */
  musica.volume = 0.6;
  musica.playbackRate = 0.9;
  musica.play().catch(e => console.log(e));

  crearFlores();
  animar();
});

/* CONTADOR */
const inicio = new Date(2023, 3, 25, 17, 0, 0); // abril = 3

function actualizarContador() {
  const ahora = new Date();
  const diff = ahora - inicio;

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const minutos = Math.floor(diff / (1000 * 60)) % 60;
  const segundos = Math.floor(diff / 1000) % 60;

  contador.innerHTML =
    `Mi amor por ti comenzó hace...<br>
     ${dias} días ${horas} horas ${minutos} minutos ${segundos} segundos`;
}

setInterval(actualizarContador, 1000);