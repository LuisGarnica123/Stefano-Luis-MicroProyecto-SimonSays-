document.addEventListener("DOMContentLoaded", () => {
    const colores = ["green", "red", "yellow", "blue"];
    let secuenciaJuego = [];
    let secuenciaUsuario = [];
    let jugadorNombre = "";
    let nivel = 0;
    let state = "presionartecla";

    const iniciarBtn = document.querySelector(".iniciar");
    const inputNombre = document.getElementById("jugadornombre");
    const botones = document.querySelectorAll("#green, #red, #yellow, #blue");
    const scoreDisplay = document.querySelector(".current-score div");
    const gameOverDiv = document.getElementById("game-over-container");
    const reiniciarBtn = document.getElementById("reiniciar-btn");
    const mensajeFinal = document.getElementById("mensaje-final");
    const tablaPuntajes = document.querySelector("#mejorespuntajes tbody");

    iniciarBtn.addEventListener("click", StarGame);
    reiniciarBtn.addEventListener("click", reiniciarJuego);
    botones.forEach(boton => boton.addEventListener("click", manejarInputUsuario));

    function StarGame() {
        if (state === "presionartecla") {
            jugadorNombre = inputNombre.value.trim();
            if (jugadorNombre === "") {
                alert("Por favor, ingresa tu nombre antes de iniciar.");
                return;
            }
            state = "jugando";
            secuenciaJuego = [];
            secuenciaUsuario = [];
            newjuego();
        }
    }

    function newjuego() {
        nivel++;
        scoreDisplay.textContent = nivel.toString().padStart(2,"0");
        siguienteRonda();
    }

    function siguienteRonda() {
        secuenciaUsuario = [];
        const colorAleatorio = colores[Math.floor(Math.random() * 4)];
        secuenciaJuego.push(colorAleatorio);
        mostrarSecuencia();
    }

    function mostrarSecuencia() {
        let i = 0;
        const intervalo = setInterval(() => {
            iluminarBoton(secuenciaJuego[i]);
            i++;
            if (i >= secuenciaJuego.length) clearInterval(intervalo);
        }, 1000);
    }

    function iluminarBoton(color) { 
        const boton = document.getElementById(color); 
        boton.classList.add("activo");
        setTimeout(() => boton.classList.remove("activo"), 300);
    }

    function manejarInputUsuario(event) {
        if (state !== "jugando") return;
        const colorPresionado = event.target.id;
        secuenciaUsuario.push(colorPresionado);
        iluminarBoton(colorPresionado); 
        verificarRespuesta();
    }

    function verificarRespuesta() {
        const indice = secuenciaUsuario.length - 1;
        if (secuenciaUsuario[indice] !== secuenciaJuego[indice]) {
            mostrarGameOver();
            return;
        }
        if (secuenciaUsuario.length === secuenciaJuego.length) {
            nivel++;  
            scoreDisplay.textContent = nivel.toString().padStart(2,"0");
            setTimeout(siguienteRonda, 1000);
        }
    }

    function mostrarGameOver() {
        state = "gameover";
        const puntajeFinal = nivel - 1;
        
        // Mostrar mensaje de juego terminado
        gameOverDiv.style.display = "block";
        mensajeFinal.innerHTML = `¡${jugadorNombre}, tu puntaje final es: ${puntajeFinal}!`;
        
        // Agregar a la tabla de puntajes
        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${jugadorNombre}</td>
            <td>${puntajeFinal}</td>
        `;
        tablaPuntajes.appendChild(nuevaFila);
        
        // Deshabilitar botones del juego
        botones.forEach(boton => boton.style.pointerEvents = "none");
    }

    function reiniciarJuego() {
        state = "presionartecla";
        nivel = 0;
        secuenciaJuego = [];
        secuenciaUsuario = [];
        scoreDisplay.textContent = "00";
        gameOverDiv.style.display = "none";
        inputNombre.value = "";
        inputNombre.focus();
        botones.forEach(boton => {
            boton.classList.remove("activo");
            boton.style.pointerEvents = "auto";
        });
    }
});