// game.js - Lógica del Juego

document.addEventListener('DOMContentLoaded', inicializarJuego);

const urlParams = new URLSearchParams(window.location.search);
const levelId = parseInt(urlParams.get('levelId')) || 1; 
let nivelActual, verbosDelNivel = [], indiceVerboActual = 0, verboActualQuiz, targetForma, housePoints = 0;
const PUNTUACION_META = 100; 

function inicializarJuego() {
    if(typeof window.verbosIrregulares === 'undefined') return;

    nivelActual = window.nivelesMagicos.find(n => n.id === levelId);
    if(!nivelActual) return;
    
    verbosDelNivel = window.verbosIrregulares.filter(v => v.id >= nivelActual.min_id && v.id <= nivelActual.max_id);
    
    document.getElementById('level-title').textContent = nivelActual.nombre;
    
    document.getElementById('next-verb-btn').onclick = () => {
        indiceVerboActual = (indiceVerboActual + 1) % verbosDelNivel.length;
        mostrarVerboActual();
    };
    document.getElementById('start-duel-btn').onclick = enterDuelMode;
    document.getElementById('quiz-form').onsubmit = (e) => {
        e.preventDefault();
        comprobarRespuestaQuiz();
    };
    
    mostrarVerboActual();
    actualizarPuntuacion();
}

function mostrarVerboActual() {
    if (!verbosDelNivel.length) return;
    const v = verbosDelNivel[indiceVerboActual];
    document.getElementById('verb-presente').textContent = v.presente;
    const backTitle = document.getElementById('verb-presente-back');
    if(backTitle) backTitle.textContent = v.presente;
    document.getElementById('verb-pasado').textContent = v.pasado;
    document.getElementById('verb-participio').textContent = v.participio;
    document.getElementById('verb-espanol').textContent = v.espanol;
    const card = document.querySelector('.dueling-card');
    if(card) card.classList.remove('is-flipped');
}

function enterDuelMode() {
    document.getElementById('study-section').style.display = 'none';
    document.getElementById('duel-section').style.display = 'block';
    housePoints = 0; actualizarPuntuacion(); empezarDesafio();
}

function actualizarPuntuacion() {
    const bar = document.getElementById('progress-bar');
    const pct = Math.min((housePoints / PUNTUACION_META) * 100, 100);
    bar.style.width = `${pct}%`;
    const left = Math.max(0, (PUNTUACION_META - housePoints)/5);
    bar.textContent = housePoints >= PUNTUACION_META ? "🏆 LEVEL MASTERED!" : `Hits left: ${left}`;
}

function empezarDesafio() {
    if(housePoints >= PUNTUACION_META) {
        localStorage.setItem(`nivel_${levelId}_completado`, 'true');
        
        // MENSAJE DE VICTORIA CON OBJETO
        const feedback = document.getElementById('quiz-feedback');
        feedback.innerHTML = `
            <div style="background:#ffdb58; padding:15px; border-radius:10px; border:4px solid #d3a625; color:#740001;">
                <div style="font-size:3rem; margin-bottom:10px;">${nivelActual.icon}</div>
                <h3 style="font-size:1.5rem; font-weight:bold;">${nivelActual.reward} FOUND!</h3>
                <p>You have mastered this level.</p>
                <a href="index.html" class="magic-button" style="display:inline-block; margin-top:10px; text-decoration:none;">Open Trunk 🎒</a>
            </div>
        `;
        document.getElementById('quiz-input').disabled = true;
        document.querySelector('#quiz-form button').disabled = true;
        return;
    }
    const rand = Math.floor(Math.random() * verbosDelNivel.length);
    verboActualQuiz = verbosDelNivel[rand];
    const types = ['pasado', 'participio', 'espanol'];
    targetForma = types[Math.floor(Math.random() * types.length)];
    const labels = { 'pasado': 'PAST SIMPLE', 'participio': 'PARTICIPLE', 'espanol': 'MEANING' };
    document.getElementById('quiz-verb-presente').textContent = verboActualQuiz.presente;
    document.getElementById('quiz-form-target').textContent = labels[targetForma];
    const input = document.getElementById('quiz-input');
    input.value = ''; input.disabled = false; document.querySelector('#quiz-form button').disabled = false;
    document.getElementById('quiz-feedback').innerHTML = ''; input.focus();
}

function comprobarRespuestaQuiz() {
    const input = document.getElementById('quiz-input');
    input.disabled = true; document.querySelector('#quiz-form button').disabled = true;
    const userAns = input.value.toLowerCase().trim();
    const correctOpts = verboActualQuiz[targetForma].split('/').map(s => s.toLowerCase().trim());
    const fb = document.getElementById('quiz-feedback');
    
    if(correctOpts.includes(userAns)) {
        housePoints += 5; actualizarPuntuacion();
        fb.innerHTML = '<span style="color:green; font-size:1.2rem; font-weight:bold;">✨ SPLENDID!</span>';
    } else {
        fb.innerHTML = `<span style="color:red; font-weight:bold;">💥 The answer was: ${correctOpts[0]}</span>`;
        input.classList.add('shake'); setTimeout(()=>input.classList.remove('shake'), 500);
    }
    setTimeout(empezarDesafio, 2500);
}