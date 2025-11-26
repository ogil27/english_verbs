// app.js - Lógica Visual con Imágenes Reales y Desbloqueo Total

document.addEventListener('DOMContentLoaded', () => {
    generarBaul();
    generarMapa();
    
    // Listener para el botón de instrucciones
    const instrBtn = document.getElementById('instructions-btn');
    if(instrBtn) {
        instrBtn.addEventListener('click', toggleInstructions);
    }
});

function toggleInstructions() {
    const panel = document.getElementById('instructions-panel');
    const btn = document.getElementById('instructions-btn');
    
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
        btn.textContent = 'Hide Instructions 📜';
        // Scroll suave hacia las instrucciones
        panel.scrollIntoView({ behavior: 'smooth' });
    } else {
        panel.style.display = 'none';
        btn.textContent = 'Gamer Instructions 📜';
    }
}

function generarBaul() {
    const grid = document.getElementById('trunk-grid');
    if (!grid || !window.nivelesMagicos) return;

    grid.innerHTML = '';

    window.nivelesMagicos.forEach(level => {
        const isCollected = localStorage.getItem(`nivel_${level.id}_completado`) === 'true';
        
        const slot = document.createElement('div');
        slot.className = `trunk-slot ${isCollected ? 'collected' : ''}`;
        
        // Usar imagen de asset si existe, o fallback
        const imgSrc = level.asset_img || "https://cdn-icons-png.flaticon.com/512/10608/10608973.png";
        
        slot.innerHTML = `
            <img src="${imgSrc}" class="slot-img" alt="${level.reward_name}">
            <div class="slot-name">${level.reward_name}</div>
        `;
        grid.appendChild(slot);
    });
}

function generarMapa() {
    const container = document.getElementById('map-container');
    if (!container || !window.nivelesMagicos) return;

    container.innerHTML = '';

    window.nivelesMagicos.forEach(level => {
        const link = document.createElement('a');
        link.className = 'level-medallion';
        
        // Lógica de desbloqueo: AHORA SIEMPRE ES TRUE (Libertad Total)
        const isCompleted = localStorage.getItem(`nivel_${level.id}_completado`) === 'true';
        let isUnlocked = true; 

        // Definir imagen inicial: Si está completado, usa la 'Activa' siempre. Si no, la 'Normal'.
        const initialImg = isCompleted ? level.img_active : level.img_normal;
        const hoverImg = level.img_active;
        const normalImg = level.img_normal;

        const fallbackImg = "https://via.placeholder.com/220x220/580808/c59d3e?text=" + encodeURIComponent(level.nombre);

        // Configuración del enlace (siempre activo)
        link.href = `game.html?levelId=${level.id}`;
        
        // Marca visual de completado
        const checkMark = isCompleted ? '<span class="check-mark">✓</span>' : '';

        link.innerHTML = `
            <div class="medallion-wrapper">
                <img src="${initialImg}" id="img-${level.id}" class="medallion-img" onerror="this.src='${fallbackImg}'">
                ${checkMark}
            </div>
            <div class="medallion-label">${level.nombre}</div>
        `;

        // EVENTOS DE INTERACCIÓN (HOVER)
        // Solo cambiamos la imagen al pasar el ratón si NO está completado
        // (Si está completado, ya mostramos la versión activa/brillante fija)
        if (!isCompleted) {
            link.addEventListener('mouseenter', () => {
                const img = document.getElementById(`img-${level.id}`);
                if(img) img.src = hoverImg;
            });
            link.addEventListener('mouseleave', () => {
                const img = document.getElementById(`img-${level.id}`);
                if(img) img.src = normalImg;
            });
        }

        container.appendChild(link);
    });
}