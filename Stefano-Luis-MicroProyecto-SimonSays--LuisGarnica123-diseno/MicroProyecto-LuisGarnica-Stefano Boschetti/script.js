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
    const reiniciarBtn = document.querySelectorAll(".reiniciar-btn");
    const mensajeFinal = document.getElementById("mensaje-final");
    const tablaPuntajes = document.querySelector("#mejorespuntajes tbody");
    const audioAmarillo = new Audio('./audios/AMARILLO.mp3');
    const audioRojo = new Audio('./audios/ROJO.mp3');
    const audioVerde = new Audio('./audios/VERDE.mp3');
    const audioAzul = new Audio('./audios/AZUL.mp3');
    const audioWin = new Audio('./audios/WIN.mp3');
    const audioGameOver = new Audio('./audios/GAMEOVER.mp3');
    const audioStart = new Audio('./audios/START.mp3');
    // Con esto rellenamos la tabla de mejores puntuaciones desde el Local Storage
    let topPlayers = localStorage.getItem("score").split(",")
    topPlayers.sort((a,b) =>  parseInt(a.split(":")[1]) - parseInt(b.split(":")[1]) ).reverse()
    for (score of topPlayers.slice(0,10)){
        let aux = score.split(":")
        let nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${aux[0]}</td>
            <td>${aux[1]}</td>`;
        tablaPuntajes.appendChild(nuevaFila);
    }
        

    iniciarBtn.addEventListener("click", StartGame);
    reiniciarBtn.forEach(boton => boton.addEventListener("click", reiniciarJuego));
    botones.forEach(boton => boton.addEventListener("click", manejarInputUsuario));
    
    function StartGame() {
        if (state === "presionartecla") {
            jugadorNombre = inputNombre.value.trim();
            if (jugadorNombre === "") {
                alert("Por favor, ingresa tu nombre antes de iniciar.");
                return;
            }
            document.querySelector(".panel-container").classList.remove("inactivo");
            document.querySelector(".menu").classList.add("not-visible")
            document.querySelector(".goodluck").innerHTML = `Buena suerte, ${jugadorNombre}`
            document.querySelector(".menu-restart").classList.remove("not-visible")
            state = "reproduciendo";
            secuenciaJuego = [];
            secuenciaUsuario = [];                   
            newjuego();
        }
    }

    function newjuego() {
        scoreDisplay.textContent = nivel.toString().padStart(2,"0");
        audioStart.volume = 0.5;
        audioStart.play()
        setTimeout(siguienteRonda, 1000);
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
            // Reproducimos sonidos de los botones
            if (secuenciaJuego[i] == "green") audioVerde.play();
            else if (secuenciaJuego[i] == "red") audioRojo.play();
            else if (secuenciaJuego[i] == "blue") audioAzul.play();
            else if (secuenciaJuego[i] == "yellow") audioAmarillo.play();
            i++;
            if (i >= secuenciaJuego.length){
                state = "jugando"
                clearInterval(intervalo);
            }
        }, 500);
    }

    function iluminarBoton(color) { 
        const boton = document.getElementById(color); 
        boton.classList.add("activo");
        setTimeout(() => boton.classList.remove("activo"), 300);
    }

    function manejarInputUsuario(event) {
        if (state == "reproduciendo") {return}
        if (state !== "jugando") {
            alert("Porfavor inicia una partida");
            return
        }
        let colorPresionado = event.target.id;
        // Reproducimos sonidos de los botones
        if (colorPresionado == "green") audioVerde.play();
            else if (colorPresionado == "red") audioRojo.play();
            else if (colorPresionado == "blue") audioAzul.play();
            else if (colorPresionado == "yellow") audioAmarillo.play();

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
            state = "reproduciendo"
            nivel++;  
            scoreDisplay.textContent = nivel.toString().padStart(2,"0");
            audioWin.play();
            setTimeout(siguienteRonda, 700);
        }
    }

    function mostrarGameOver() {
        audioGameOver.volume = 0.5
        audioGameOver.play()
        document.querySelector(".panel-container").classList.add("inactivo");
        document.querySelector(".menu-restart").classList.add("not-visible")
        state = "gameover";        
        // Mostrar mensaje de juego terminado
        gameOverDiv.style.display = "block";
        mensajeFinal.innerHTML = `¡${jugadorNombre}, tu puntaje final es: ${nivel}!`;
        
        // Agregar a al local storage de puntajes
        if ( localStorage.getItem("score") ){
            localStorage.setItem("score", localStorage.getItem("score") +`, ${jugadorNombre}:${nivel}` ) 
        }else{
            localStorage.setItem("score", `${jugadorNombre}:${nivel}` ) 
        }
        tablaPuntajes.innerHTML = ""
        let topPlayers = localStorage.getItem("score").split(",")
        topPlayers.sort((a,b) =>  parseInt(a.split(":")[1]) - parseInt(b.split(":")[1]) ).reverse()
        for (score of topPlayers.slice(0,10)){
            let aux = score.split(":")
            let nuevaFila = document.createElement("tr");
            nuevaFila.innerHTML = `
                <td>${aux[0]}</td>
                <td>${aux[1]}</td>`;
            tablaPuntajes.appendChild(nuevaFila);
        }
        
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
        document.querySelector(".panel-container").classList.add("inactivo");
        document.querySelector(".menu").classList.remove("not-visible")
        document.querySelector(".menu-restart").classList.add("not-visible")
        botones.forEach(boton => {
            boton.classList.remove("activo");
            boton.style.pointerEvents = "auto";
        });
    }
});