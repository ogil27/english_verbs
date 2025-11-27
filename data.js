// data.js - Configuración de Niveles y Artefactos del Baúl

window.nivelesMagicos = [
    { 
        id: 1, 
        nombre: "Diagon Alley", 
        patron: "Basic Verbs", 
        min_id: 1, max_id: 20,
        // Medallones del Menú
        img_normal: "13_Medallon_Callejon_MuroCerrado_Normal.png",
        img_active: "14_Medallon_Callejon_MuroAbierto_Activo.png",
        // Recompensa del Baúl (Artefacto)
        reward_name: "Magic Wand",
        asset_img: "07_Artefacto_Varita_Recolectada.png" 
    },
    { 
        id: 2, 
        nombre: "Mirror of Erised", 
        patron: "Past Reflections", 
        min_id: 21, max_id: 40,
        img_normal: "15_Medallon_Espejo_ReflejoBorrascoso_Normal.png",
        img_active: "16_Medallon_Espejo_ReflejoPadres_Activo.png",
        reward_name: "Philosopher's Stone",
        asset_img: "08_Artefacto_Espejo_Fantasma.png" // Cambiar a versión recolectada si existe
    },
    { 
        id: 3, 
        nombre: "Dueling Club", 
        patron: "Combat Spells", 
        min_id: 41, max_id: 60,
        img_normal: "17_Medallon_Duelo_VaritasEstaticas_Normal.png",
        img_active: "18_Medallon_Duelo_VaritasChispas_Activo.png",
        reward_name: "Dueling Badge",
        asset_img: "09_Artefacto_Duelo_Fantasma.png" // Cambiar a versión recolectada si existe
    },
    { 
        id: 4, 
        nombre: "Chamber of Secrets", 
        patron: "Hidden Irregulars", 
        min_id: 61, max_id: 80,
        img_normal: "19_Medallon_Camara_DiarioEstatico_Normal.png",
        img_active: "20_Medallon_Camara_DiarioSangrando_Activo.png",
        reward_name: "Tom Riddle's Diary",
        asset_img: "10_Artefacto_Diario_Fantasma.png" // Cambiar a versión recolectada si existe
    },
    { 
        id: 5, 
        nombre: "Hogsmeade", 
        patron: "Village Words", 
        min_id: 81, max_id: 100,
        img_normal: "21_Medallon_Hogsmeade_Cerveza_Normal.png",
        img_active: "22_Medallon_Hogsmeade_CervezaEspuma_Activo.png",
        reward_name: "Butterbeer",
        asset_img: "11_Artefacto_Cerveza_Fantasma.png" // Cambiar a versión recolectada si existe
    },
    { 
        id: 6, 
        nombre: "Time Turner", 
        patron: "Time Mastery", 
        min_id: 101, max_id: 118,
        img_normal: "23_Medallon_Giratiempo_Estatico_Normal.png",
        img_active: "24_Medallon_Giratiempo_ArenaFluyendo_Activo.png",
        reward_name: "Time Turner",
        asset_img: "12_Artefacto_Giratiempo_Fantasma.png" // Cambiar a versión recolectada si existe
    }
];

// Verificación de seguridad para verbos.js
if (typeof window.verbosIrregulares === 'undefined') {
    console.error("⚠️ ERROR CRÍTICO: 'verbos.js' no se ha cargado.");
    window.verbosIrregulares = [];
}