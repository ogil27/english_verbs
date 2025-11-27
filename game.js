// game.js - Lógica del Juego con Meta Fija de 20 Aciertos

document.addEventListener('DOMContentLoaded', inicializarJuego);

// =================================================================
// 1. CONFIGURACIÓN
// =================================================================

const urlParams = new URLSearchParams(window.location.search);
const levelId = parseInt(urlParams.get('levelId')) || 1; 

let nivelActual;
let verbosDelNivel = [];      // Referencia de datos
let mazoPreguntas = [];       // Mazo completo de preguntas posibles
let preguntaActualIndex = -1; // Índice de la pregunta activa
let verboActualQuiz;          // Verbo activo
let targetForma;              // Tipo de pregunta
let housePoints = 0; 
let aciertosActuales = 0;     // Contador de aciertos en esta sesión

// META FIJA: 20 Aciertos para pasar el nivel
const PREGUNTAS_META = 20;
const PUNTOS_POR_ACIERTO = 5;
const PUNTUACION_OBJETIVO = PREGUNTAS_META * PUNTOS_POR_ACIERTO; // 100 Puntos

const TIEMPO_ESPERA = 2500; 

// =================================================================
// 2. FUNCIONES UI
// =================================================================

function mostrarError(mensaje) {
    const titulo = document.getElementById('level-title');
    if (titulo) titulo.textContent = "⚠️ Magic Error";
    console.error(mensaje);
}

let indiceEstudio = 0;
function mostrarVerboActual() {
    if (!verbosDelNivel.length) return;
    const v = verbosDelNivel[indiceEstudio];
    
    document.getElementById('verb-presente').textContent = v.presente;
    const backTitle = document.getElementById('verb-presente-back');
    if(backTitle) backTitle.textContent = v.presente;
    
    document.getElementById('verb-pasado').textContent = v.pasado;
    document.getElementById('verb-participio').textContent = v.participio;
    document.getElementById('verb-espanol').textContent = v.espanol;

    const card = document.querySelector('.dueling-card');
    if(card) card.classList.remove('is-flipped');
}

function actualizarPuntuacion() {
    const pointsSpan = document.querySelector('#house-points span');
    if (pointsSpan) pointsSpan.textContent = housePoints;
    
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const porcentaje = Math.min((aciertosActuales / PREGUNTAS_META) * 100, 100);
        const aciertosRestantes = Math.max(0, PREGUNTAS_META - aciertosActuales);
        
        progressBar.style.width = `${porcentaje}%`;
        
        if (aciertosActuales >= PREGUNTAS_META) {
             progressBar.textContent = "🏆 VICTORY! 🏆";
        } else {
             progressBar.textContent = `Spells to cast: ${aciertosRestantes} (${housePoints}/${PUNTUACION_OBJETIVO} pts)`;
        }
    }
}

// =================================================================
// 3. GESTIÓN DE MODOS
// =================================================================

function enterDuelMode() {
    document.getElementById('study-section').style.display = 'none';
    document.getElementById('duel-section').style.display = 'block';
    
    // Resetear para el duelo
    housePoints = 0;
    aciertosActuales = 0;
    
    // Generar mazo completo (3 preguntas por verbo)
    mazoPreguntas = [];
    verbosDelNivel.forEach(v => {
        mazoPreguntas.push({ verbo: v, tipo: 'pasado' });
        mazoPreguntas.push({ verbo: v, tipo: 'participio' });
        mazoPreguntas.push({ verbo: v, tipo: 'espanol' });
    });
    
    // Barajar mazo (opcional pero recomendado)
    mazoPreguntas.sort(() => Math.random() - 0.5);
    
    console.log(`⚔️ Duelo iniciado. Meta: ${PREGUNTAS_META} aciertos.`);
    
    actualizarPuntuacion();
    empezarDesafio();
    window.scrollTo(0,0);
}

// =================================================================
// 4. LÓGICA DEL JUEGO
// =================================================================

function siguienteVerboEstudio() {
    indiceEstudio = (indiceEstudio + 1) % verbosDelNivel.length;
    mostrarVerboActual();
}

function comprobarVictoria() {
    // La victoria ocurre al llegar a la meta de aciertos
    if (aciertosActuales >= PREGUNTAS_META) {
        localStorage.setItem(`nivel_${levelId}_completado`, 'true');
        
        const artifactName = nivelActual.reward_name || "Magical Artifact";
        const artifactImg = nivelActual.asset_img || "";

        const feedback = document.getElementById('quiz-feedback');
        feedback.innerHTML = `
            <div style="background:#ffdb58; padding:20px; border-radius:15px; border:4px solid #d3a625; color:#740001; box-shadow: 0 10px 25px rgba(0,0,0,0.3); animation: popIn 0.5s;">
                <img src="${artifactImg}" style="width:100px; height:auto; margin:0 auto 15px; display:block; filter:drop-shadow(0 5px 5px rgba(0,0,0,0.3));" onerror="this.style.display='none'">
                <h3 style="font-size:1.5rem; font-weight:bold; margin-bottom:10px; font-family:'Cinzel Decorative';">${artifactName} COLLECTED!</h3>
                <p style="font-size:1.1rem;">You have proven your worth with 20 spells!</p>
                <a href="index.html" class="magic-button" style="display:inline-block; margin-top:15px; text-decoration:none;">Open Trunk 🎒</a>
            </div>
        `;
        
        document.getElementById('quiz-input').disabled = true;
        document.querySelector('#quiz-form button').disabled = true;
        return true;
    }
    return false;
}

function empezarDesafio() {
    if (comprobarVictoria()) return;
    
    // Si nos quedamos sin preguntas antes de llegar a la meta (raro, pero posible si el nivel tiene pocos verbos)
    // regeneramos el mazo con las preguntas ya usadas para seguir practicando.
    if (mazoPreguntas.length === 0) {
        verbosDelNivel.forEach(v => {
            mazoPreguntas.push({ verbo: v, tipo: 'pasado' });
            mazoPreguntas.push({ verbo: v, tipo: 'participio' });
            mazoPreguntas.push({ verbo: v, tipo: 'espanol' });
        });
        mazoPreguntas.sort(() => Math.random() - 0.5);
    }

    // Seleccionar siguiente carta
    const randomIndex = Math.floor(Math.random() * mazoPreguntas.length);
    preguntaActualIndex = randomIndex;
    const carta = mazoPreguntas[randomIndex];
    
    verboActualQuiz = carta.verbo;
    targetForma = carta.tipo;
    
    const labels = { 'pasado': 'PAST SIMPLE', 'participio': 'PAST PARTICIPLE', 'espanol': 'MEANING (ES)' };

    // UI
    document.getElementById('quiz-verb-presente').textContent = verboActualQuiz.presente;
    const targetEl = document.getElementById('quiz-form-target');
    targetEl.textContent = labels[targetForma];
    
    let colorClass = "text-yellow-600";
    if (targetForma === 'pasado') colorClass = "text-red-600";
    if (targetForma === 'participio') colorClass = "text-green-600";
    if (targetForma === 'espanol') colorClass = "text-blue-600";
    targetEl.className = `font-extrabold underline mx-1 uppercase ${colorClass}`;

    const input = document.getElementById('quiz-input');
    input.value = '';
    input.disabled = false;
    document.querySelector('#quiz-form button').disabled = false;
    document.getElementById('quiz-feedback').innerHTML = '';
    input.focus();
}

function comprobarRespuestaQuiz() {
    const input = document.getElementById('quiz-input');
    const feedback = document.getElementById('quiz-feedback');
    const btn = document.querySelector('#quiz-form button');

    input.disabled = true;
    btn.disabled = true;

    const respuestaUsuario = input.value.toLowerCase().trim();
    const respuestaCorrectaString = verboActualQuiz[targetForma];
    const respuestasPosibles = respuestaCorrectaString.split('/').map(r => r.toLowerCase().trim());

    if (respuestasPosibles.includes(respuestaUsuario)) {
        // ACIERTO
        housePoints += PUNTOS_POR_ACIERTO;
        aciertosActuales++;
        
        // Retirar la carta acertada del mazo
        mazoPreguntas.splice(preguntaActualIndex, 1);
        
        actualizarPuntuacion();
        
        const toGo = PREGUNTAS_META - aciertosActuales;
        if (toGo > 0) {
            feedback.innerHTML = `<span style="color:green; font-weight:bold; font-size:1.2rem;">✨ MAGNIFICENT!</span><br><span style="font-size:0.9rem; color:#555;">${toGo} more to win...</span>`;
        }
        
    } else {
        // FALLO
        feedback.innerHTML = `
            <span style="color:red; font-weight:bold; font-size:1.2rem;">💥 MISSED!</span><br>
            <span style="color:#333;">Answer: </span><strong style="color:#740001; text-transform:uppercase;">${respuestasPosibles[0]}</strong>
        `;
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        // No retiramos la carta, volverá a salir
    }

    setTimeout(empezarDesafio, TIEMPO_ESPERA);
}

// =================================================================
// 5. INICIALIZACIÓN
// =================================================================

function inicializarJuego() {
    if (typeof window.verbosIrregulares === 'undefined' || typeof window.nivelesMagicos === 'undefined') {
        document.body.innerHTML = "<h1 style='color:white;text-align:center'>Error: Data files missing</h1>";
        return;
    }

    nivelActual = window.nivelesMagicos.find(n => n.id === levelId);
    if (!nivelActual) {
        document.getElementById('level-title').textContent = "Level Not Found";
        return;
    }

    verbosDelNivel = window.verbosIrregulares.filter(v => v.id >= nivelActual.min_id && v.id <= nivelActual.max_id);

    if (verbosDelNivel.length === 0) {
        document.getElementById('level-title').textContent = "Empty Level";
        return;
    }

    document.getElementById('level-title').textContent = nivelActual.nombre;

    document.getElementById('next-verb-btn').onclick = siguienteVerboEstudio;
    document.getElementById('start-duel-btn').onclick = enterDuelMode;
    document.getElementById('quiz-form').onsubmit = (e) => {
        e.preventDefault();
        comprobarRespuestaQuiz();
    };

    mostrarVerboActual();
    actualizarPuntuacion(); 
    
    console.log(`🪄 Level Loaded: ${nivelActual.nombre}`);
}