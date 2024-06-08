let turno = 0;
let tablero = [];
let jugador1Score = 0;
let jugador2Score = 0;
const botones = document.querySelectorAll('button');
const jugador1ScoreElement = document.getElementById('jugador1-score');
const jugador2ScoreElement = document.getElementById('jugador2-score');
const audio = document.getElementById("miaudio").play();

botones.forEach((boton, i) => {
  boton.addEventListener('click', () => {
    botonPulsado(i);
  });
});

function botonPulsado(pos) {
  const boton = botones[pos];

  // Verificar si el cuadro ya ha sido seleccionado
  if (esCuadroSeleccionado(pos)) {
    return; // Si ya ha sido seleccionado, no se hace nada
  }

  turno++;
  const color = turno % 2 ? 'salmon' : 'paleGreen';
  boton.style.backgroundColor = color;
  tablero[pos] = color;

  if (haGanado()) {
    if (color === 'salmon') {
      jugador1Score++;
      jugador1ScoreElement.textContent = jugador1Score;
      alert('¡Jugador 1 ha ganado!');
    } else {
      jugador2Score++;
      jugador2ScoreElement.textContent = jugador2Score;
      alert('¡Jugador 2 ha ganado!');
    }
    reiniciarJuego();
  } else if (turno === 9) {
    alert('Ha sido un empate');
    reiniciarJuego();
  }
}

function esCuadroSeleccionado(pos) {
  return tablero[pos] !== undefined;
}

function haGanado() {
  // Validación horizontal
  for (let i = 0; i <= 6; i += 3) {
    if (tablero[i] && tablero[i] === tablero[i + 1] && tablero[i] === tablero[i + 2]) {
      return true;
    }
  }

  // Validación vertical
  for (let i = 0; i <= 2; i++) {
    if (tablero[i] && tablero[i] === tablero[i + 3] && tablero[i] === tablero[i + 6]) {
      return true;
    }
  }

  // Validación diagonal (izquierda a derecha)
  if (tablero[0] && tablero[0] === tablero[4] && tablero[0] === tablero[8]) {
    return true;
  }

  // Validación diagonal (derecha a izquierda)
  if (tablero[2] && tablero[2] === tablero[4] && tablero[2] === tablero[6]) {
    return true;
  }

  return false;
}

function reiniciarJuego() {
  turno = 0;
  tablero = [];
  botones.forEach(boton => {
    boton.style.backgroundColor = '';
  });
}