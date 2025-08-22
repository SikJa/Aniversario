// ===== VARIABLES GLOBALES =====
let currentScreen = 'main-page';
let scratchCompleted = false;
let videoCompleted = false;
let bloomCompleted = false;
let flipbook = null;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Iniciando regalo de aniversario para Elen...');
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Mostrar solo la página principal al inicio
    showScreen('main-page');
}

// ===== SISTEMA DE NAVEGACIÓN ENTRE PANTALLAS =====
function showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla solicitada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        console.log(`📱 Mostrando pantalla: ${screenId}`);
        
        // Inicializar funcionalidades específicas de cada pantalla
        if (screenId === 'scratch-page') {
            initScratchGame();
        } else if (screenId === 'video-page') {
            initVideoGame();
        } else if (screenId === 'bloom-page') {
            initBloomGame();
        } else if (screenId === 'book-page') {
            initFlipbook();
        }
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Botón de inicio
    document.getElementById('startButton').addEventListener('click', function() {
        showScreen('scratch-page');
    });
    
    // Botón para ir al juego de video
    document.getElementById('nextToVideo').addEventListener('click', function() {
        showScreen('video-page');
    });
    
    // Botón para ir al juego bloom
    document.getElementById('nextToBloom').addEventListener('click', function() {
        showScreen('bloom-page');
    });
    
    // Botón para ir al álbum
    document.getElementById('nextToBook').addEventListener('click', function() {
        showScreen('book-page');
    });
    
    // Botón para volver al inicio desde la página final
    document.getElementById('restartJourney').addEventListener('click', function() {
        // Reiniciar todas las variables
        scratchCompleted = false;
        videoCompleted = false;
        bloomCompleted = false;
        
        // Volver a la página principal
        showScreen('main-page');
        
        console.log('🔄 Reiniciando el viaje romántico...');
    });
    
    // BOTÓN PARA IR A LA PÁGINA FINAL
    document.getElementById('goToFinalPage').addEventListener('click', function() {
        console.log('✨ YENDO A LA PÁGINA FINAL ROMÁNTICA');
        showScreen('final-page');
    });
}

// ===== JUEGO 1: RASPÁ Y RECORDÁ =====
function initScratchGame() {
    const canvas = document.getElementById('scratchCanvas');
    const image = document.getElementById('scratchImage');
    const ctx = canvas.getContext('2d');
    const message = document.getElementById('scratchMessage');
    const nextButton = document.getElementById('nextToVideo');
    
    // Esperar a que la imagen se cargue
    image.onload = function() {
        setupScratchCanvas();
    };
    
    // Si la imagen ya está cargada
    if (image.complete) {
        setupScratchCanvas();
    }
    
    function setupScratchCanvas() {
        // Configurar canvas del tamaño de la imagen
        const rect = image.getBoundingClientRect();
        canvas.width = image.offsetWidth;
        canvas.height = image.offsetHeight;
        
        // Crear capa de "raspar" con gradiente
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#c0c0c0');
        gradient.addColorStop(0.5, '#a0a0a0');
        gradient.addColorStop(1, '#808080');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Agregar texto "Raspa aquí"
        ctx.fillStyle = '#666';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Raspa aquí', canvas.width / 2, canvas.height / 2);
        
        let isScratching = false;
        let scratchedPixels = 0;
        const totalPixels = canvas.width * canvas.height;
        
        function scratch(e) {
            if (!isScratching) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            
            // Crear efecto de raspado más grande
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI);
            ctx.fill();
            
            // Contar píxeles raspados
            scratchedPixels += 900; // Aproximadamente el área del círculo
            
            // Verificar si se ha raspado suficiente (30% del área)
            if (scratchedPixels > totalPixels * 0.3 && !scratchCompleted) {
                completeScratchGame();
            }
        }
        
        function completeScratchGame() {
            scratchCompleted = true;
            
            // Mostrar mensaje revelado
            message.classList.remove('hidden');
            
            // Mostrar botón de continuar después de un momento
            setTimeout(() => {
                nextButton.classList.remove('hidden');
            }, 1500);
            
            // Animación de completado
            canvas.style.transition = 'opacity 1s ease';
            canvas.style.opacity = '0';
            
            console.log('✅ Juego de raspar completado');
        }
        
        // Mouse events
        canvas.addEventListener('mousedown', (e) => {
            isScratching = true;
            scratch(e);
        });
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', () => isScratching = false);
        canvas.addEventListener('mouseleave', () => isScratching = false);
        
        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isScratching = true;
            scratch(e);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            scratch(e);
        });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            isScratching = false;
        });
    }
}

// ===== JUEGO 2: MANTENÉ PRESIONADO PARA REVELAR =====
function initVideoGame() {
    const container = document.querySelector('.video-reveal-container');
    const staticImage = document.getElementById('staticImage');
    const video = document.getElementById('revealVideo');
    const indicator = document.querySelector('.press-indicator');
    const nextButton = document.getElementById('nextToBloom');
    
    let pressTimer;
    let isPressed = false;
    let completionTimer;
    
    console.log('🎬 Inicializando juego de video...');
    
    function startPress(e) {
        if (videoCompleted) return;
        
        console.log('👆 Presión iniciada');
        isPressed = true;
        
        // Ocultar indicador inmediatamente
        indicator.style.display = 'none';
        
        // Mostrar video inmediatamente
        staticImage.style.opacity = '0';
        video.classList.remove('hidden');
        video.style.opacity = '1';
        
        // Reproducir video
        video.currentTime = 0;
        video.play().then(() => {
            console.log('▶️ Video reproduciendo');
        }).catch(err => {
            console.error('Error reproduciendo video:', err);
        });
        
        // Timer para completar el juego si se mantiene presionado por 2 segundos
        completionTimer = setTimeout(() => {
            if (isPressed) {
                completeVideoGame();
            }
        }, 2000);
    }
    
    function endPress(e) {
        if (videoCompleted) return;
        
        console.log('👆 Presión terminada');
        isPressed = false;
        clearTimeout(completionTimer);
        
        // Pausar y ocultar video
        video.pause();
        video.currentTime = 0;
        video.style.opacity = '0';
        setTimeout(() => {
            video.classList.add('hidden');
        }, 300);
        
        // Mostrar imagen estática de nuevo
        staticImage.style.opacity = '1';
        
        // Mostrar indicador de nuevo
        indicator.style.display = 'block';
    }
    
    function completeVideoGame() {
        if (videoCompleted) return;
        
        console.log('✅ Juego de video completado');
        videoCompleted = true;
        
        // Mantener el video visible y reproduciendo
        staticImage.style.opacity = '0';
        video.classList.remove('hidden');
        video.style.opacity = '1';
        video.play();
        
        // Ocultar indicador permanentemente
        indicator.style.display = 'none';
        
        // Mostrar botón de continuar después de 1 segundo
        setTimeout(() => {
            nextButton.classList.remove('hidden');
            nextButton.style.animation = 'fadeIn 0.5s ease';
        }, 1000);
    }
    
    // Cuando el video termine naturalmente
    video.addEventListener('ended', () => {
        if (isPressed) {
            video.currentTime = 0;
            video.play(); // Loop mientras esté presionado
        }
    });
    
    // EVENTOS DE MOUSE
    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startPress(e);
    });
    
    container.addEventListener('mouseup', (e) => {
        e.preventDefault();
        endPress(e);
    });
    
    container.addEventListener('mouseleave', (e) => {
        if (isPressed) {
            endPress(e);
        }
    });
    
    // EVENTOS TÁCTILES (para móviles)
    container.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startPress(e);
    });
    
    container.addEventListener('touchend', (e) => {
        e.preventDefault();
        endPress(e);
    });
    
    container.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        endPress(e);
    });
    
    // Prevenir el menú contextual
    container.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Asegurar que el video esté listo
    video.addEventListener('loadeddata', () => {
        console.log('📹 Video cargado y listo');
    });
    
    video.addEventListener('error', (e) => {
        console.error('❌ Error cargando video:', e);
    });
}

// ===== JUEGO 3: BLOOM FOCUS =====
function initBloomGame() {
    const container = document.querySelector('.bloom-container');
    const image = document.getElementById('bloomImage');
    const overlay = document.querySelector('.bloom-overlay');
    const hint = document.querySelector('.click-hint');
    const message = document.getElementById('bloomMessage');
    const nextButton = document.getElementById('nextToBook');
    
    console.log('✨ Inicializando juego Bloom Focus...');
    
    // Coordenadas donde está Elen en la foto (ajustar según la imagen real)
    // Estos valores representan porcentajes de la imagen (0-1)
    const targetArea = {
        x: 0.4, // 40% desde la izquierda
        y: 0.3, // 30% desde arriba
        width: 0.3, // 30% de ancho
        height: 0.4 // 40% de alto
    };
    
    function handleClick(e) {
        if (bloomCompleted) return;
        
        const rect = image.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) / rect.width;
        const clickY = (e.clientY - rect.top) / rect.height;
        
        console.log(`👆 Clic en: ${(clickX * 100).toFixed(1)}%, ${(clickY * 100).toFixed(1)}%`);
        
        // Verificar si el clic está en el área objetivo (donde está Elen)
        if (clickX >= targetArea.x && 
            clickX <= targetArea.x + targetArea.width &&
            clickY >= targetArea.y && 
            clickY <= targetArea.y + targetArea.height) {
            
            completeBloomGame(clickX, clickY);
        } else {
            // Efecto de "intento fallido" - pequeña animación
            image.style.transform = 'scale(0.98)';
            setTimeout(() => {
                image.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    function completeBloomGame(focusX, focusY) {
        if (bloomCompleted) return;
        
        console.log('✅ ¡Bloom Focus completado!');
        bloomCompleted = true;
        
        // Ocultar hint
        hint.classList.add('hidden');
        
        // Aplicar efecto de enfoque
        image.classList.add('focused');
        overlay.classList.add('focused');
        
        // Establecer el punto de enfoque dinámicamente
        const focusXPercent = focusX * 100;
        const focusYPercent = focusY * 100;
        overlay.style.setProperty('--focus-x', `${focusXPercent}%`);
        overlay.style.setProperty('--focus-y', `${focusYPercent}%`);
        
        // Crear efecto de partículas brillantes
        createBloomSparkles(container, focusX, focusY);
        
        // Mostrar mensaje después de la animación
        setTimeout(() => {
            message.classList.remove('hidden');
            message.style.animation = 'fadeIn 1s ease';
        }, 800);
        
        // Mostrar botón de continuar
        setTimeout(() => {
            nextButton.classList.remove('hidden');
            nextButton.style.animation = 'fadeIn 0.5s ease';
        }, 2000);
    }
    
    function createBloomSparkles(container, centerX, centerY) {
        const sparkleCount = 15;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'bloom-sparkle';
            
            // Posicionar las partículas alrededor del punto de enfoque
            const angle = (i / sparkleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 100; // Distancia variable
            const sparkleX = centerX * container.offsetWidth + Math.cos(angle) * distance;
            const sparkleY = centerY * container.offsetHeight + Math.sin(angle) * distance;
            
            sparkle.style.left = `${sparkleX}px`;
            sparkle.style.top = `${sparkleY}px`;
            sparkle.style.animationDelay = `${i * 0.1}s`;
            
            container.appendChild(sparkle);
            
            // Remover la partícula después de la animación
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2000 + (i * 100));
        }
    }
    
    // Event listeners
    container.addEventListener('click', handleClick);
    
    // También funciona con touch en móviles
    container.addEventListener('touchend', (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const clickEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY
        };
        handleClick(clickEvent);
    });
    
    // Prevenir el menú contextual
    container.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Asegurar que la imagen esté cargada
    image.addEventListener('load', () => {
        console.log('🖼️ Imagen bloom cargada');
    });
    
    image.addEventListener('error', () => {
        console.error('❌ Error cargando imagen bloom');
    });
}

// ===== ÁLBUM SIMPLE =====
function initFlipbook() {
    console.log('📖 Inicializando álbum simple...');
    
    // TODOS los archivos de tu carpeta (CORREGIDOS - solo archivos que existen)
    const mediaFiles = [
        '1.jpg', 'IMG_2337.JPG', 'IMG_2338.MOV', 'IMG_2339.MOV', 'IMG_2340.JPG', 
        'IMG_2341.JPG', 'IMG_2342.MOV', 'IMG_2343.JPG', 'IMG_2344.MOV', 'IMG_2345.JPG', 
        'IMG_2346.MOV', 'IMG_2347.MOV', 'IMG_2348.MOV', 'IMG_2349.JPG', 'IMG_2350.MOV', 
        'IMG_2350_000.jpg', 'IMG_2351.MOV', 'IMG_2352.MOV', 'IMG_2353.MOV', 'IMG_2354.MOV', 
        'IMG_2355.MOV', 'IMG_2356.MOV', 'IMG_2357.MOV', 'IMG_2358.MOV', 'IMG_2359.JPG',
        'IMG_2360.MOV', 'IMG_2361.JPG', 'IMG_2362.MOV', 'IMG_2363.MOV', 'IMG_2364.JPG', 
        'IMG_2365.MOV', 'IMG_2366.JPG', 'IMG_2367.MOV', 'IMG_2368.MOV', 'IMG_2369.MOV', 
        'IMG_2370.MOV', 'IMG_2371.MOV', 'IMG_2372.MOV', 'IMG_2373.JPG', 'IMG_2374.MOV', 
        'IMG_2375.MOV', 'IMG_2376.MOV', 'IMG_2377.MOV', 'IMG_2378.MOV', 'IMG_2379.MOV', 
        'IMG_2380.MOV'
    ];
    
    let currentIndex = 0;
    const currentMediaContainer = document.getElementById('currentMedia');
    const mediaInfo = document.getElementById('mediaInfo');
    const prevBtn = document.getElementById('prevMedia');
    const nextBtn = document.getElementById('nextMedia');
    
    // Función para cargar un archivo específico
    function loadMedia(index) {
        const filename = mediaFiles[index];
        console.log(`📄 Cargando archivo ${index + 1}: ${filename}`);
        
        const isVideo = filename.toLowerCase().includes('.mov') || filename.toLowerCase().includes('.mp4');
        
        if (isVideo) {
            // Es un video
            currentMediaContainer.innerHTML = `
                <video autoplay muted loop controls style="max-width: 100%; max-height: 100%; object-fit: contain;">
                    <source src="${filename}" type="video/mp4">
                    Tu navegador no soporta videos.
                </video>
            `;
            
            const video = currentMediaContainer.querySelector('video');
            video.addEventListener('loadeddata', () => {
                console.log(`✅ Video cargado: ${filename}`);
            });
            
            video.addEventListener('error', () => {
                console.error(`❌ Error cargando video: ${filename}`);
                currentMediaContainer.innerHTML = `<div style="text-align: center; color: #999;">Video no disponible: ${filename}</div>`;
            });
            
        } else {
            // Es una imagen
            currentMediaContainer.innerHTML = `
                <img src="${filename}" alt="Recuerdo ${index + 1}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            `;
            
            const img = currentMediaContainer.querySelector('img');
            img.addEventListener('load', () => {
                console.log(`✅ Imagen cargada: ${filename}`);
            });
            
            img.addEventListener('error', () => {
                console.error(`❌ Error cargando imagen: ${filename}`);
                currentMediaContainer.innerHTML = `<div style="text-align: center; color: #999;">Imagen no disponible: ${filename}</div>`;
            });
        }
        
        // Actualizar información
        mediaInfo.textContent = `Archivo ${index + 1} de ${mediaFiles.length}`;
        
        // Actualizar botones
        prevBtn.disabled = index <= 0;
        nextBtn.disabled = index >= mediaFiles.length - 1;
        
        currentIndex = index;
    }
    
    // Función para ir al siguiente archivo
    function nextMedia() {
        if (currentIndex < mediaFiles.length - 1) {
            loadMedia(currentIndex + 1);
        } else {
            // ¡Ha llegado al final! Ir a la página final romántica
            showScreen('final-page');
        }
    }
    
    // Función para ir al archivo anterior
    function prevMedia() {
        if (currentIndex > 0) {
            loadMedia(currentIndex - 1);
        }
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextMedia);
    prevBtn.addEventListener('click', prevMedia);
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (currentScreen === 'book-page') {
            if (e.key === 'ArrowLeft') {
                prevMedia();
            } else if (e.key === 'ArrowRight') {
                nextMedia();
            }
        }
    });
    
    // Navegación táctil para móviles
    let startX = 0;
    let endX = 0;
    
    currentMediaContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    currentMediaContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        // Swipe hacia la izquierda (siguiente)
        if (diff > 50) {
            nextMedia();
        }
        // Swipe hacia la derecha (anterior)
        else if (diff < -50) {
            prevMedia();
        }
    });
    
    // Cargar el primer archivo
    loadMedia(0);
    
    console.log(`📚 Álbum configurado con ${mediaFiles.length} archivos`);
}

// ===== POPUP FINAL ROMÁNTICO - VERSIÓN ABSOLUTA =====
function showFinalPopup() {
    console.log('💖 ¡MOSTRANDO MENSAJE FINAL ROMÁNTICO - VERSIÓN ABSOLUTA!');
    
    // CREAR EL POPUP DIRECTAMENTE EN EL BODY - MÉTODO ABSOLUTO
    const popupHTML = `
        <div id="absolutePopup" style="
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0,0,0,0.9) !important;
            z-index: 99999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            backdrop-filter: blur(10px) !important;
        ">
            <div style="
                background: linear-gradient(135deg, #fff 0%, #fef7f7 100%) !important;
                border-radius: 30px !important;
                padding: 50px 40px !important;
                text-align: center !important;
                max-width: 500px !important;
                width: 90% !important;
                box-shadow: 0 25px 60px rgba(255, 107, 157, 0.6) !important;
                border: 3px solid rgba(255, 107, 157, 0.3) !important;
                animation: popupBounce 0.8s ease-out !important;
            ">
                <div style="
                    font-size: 5rem !important;
                    margin-bottom: 20px !important;
                    animation: heartPulse 1.5s ease-in-out infinite !important;
                ">💖</div>
                
                <h2 style="
                    font-size: 2.8rem !important;
                    color: #333 !important;
                    margin-bottom: 30px !important;
                    font-weight: 300 !important;
                    letter-spacing: 1px !important;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                ">Mira mi bolsillo</h2>
                
                <div style="
                    font-size: 3.5rem !important;
                    color: #ff6b9d !important;
                    font-weight: bold !important;
                    margin-bottom: 40px !important;
                    text-shadow: 0 5px 15px rgba(255, 107, 157, 0.6) !important;
                    animation: loveShine 2s ease-in-out infinite alternate !important;
                ">Te amo</div>
                
                <button onclick="closeAbsolutePopup()" style="
                    background: linear-gradient(135deg, #ff6b9d, #ff8fab) !important;
                    color: white !important;
                    border: none !important;
                    width: 70px !important;
                    height: 70px !important;
                    border-radius: 50% !important;
                    font-size: 2rem !important;
                    cursor: pointer !important;
                    box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4) !important;
                    transition: all 0.3s ease !important;
                " onmouseover="this.style.transform='scale(1.1) translateY(-3px)'" onmouseout="this.style.transform='scale(1) translateY(0)'">❤️</button>
            </div>
        </div>
    `;
    
    // INSERTAR EL POPUP DIRECTAMENTE EN EL BODY
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // AGREGAR ESTILOS DE ANIMACIÓN DINÁMICAMENTE
    const animationCSS = `
        <style>
            @keyframes popupBounce {
                0% { opacity: 0; transform: scale(0.3) rotate(-10deg); }
                50% { transform: scale(1.1) rotate(5deg); }
                100% { opacity: 1; transform: scale(1) rotate(0deg); }
            }
            @keyframes heartPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            @keyframes loveShine {
                0% { text-shadow: 0 5px 15px rgba(255, 107, 157, 0.6); transform: scale(1); }
                100% { text-shadow: 0 8px 25px rgba(255, 107, 157, 0.9); transform: scale(1.05); }
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', animationCSS);
    
    // CREAR CORAZONES FLOTANTES
    setTimeout(() => {
        createAbsoluteHearts();
    }, 500);
    
    console.log('💕 ¡POPUP ROMÁNTICO MOSTRADO CON ÉXITO!');
}

// FUNCIÓN GLOBAL PARA CERRAR EL POPUP
window.closeAbsolutePopup = function() {
    const popup = document.getElementById('absolutePopup');
    if (popup) {
        popup.remove();
        console.log('💕 Popup romántico cerrado');
    }
}

function createAbsoluteHearts() {
    const popup = document.getElementById('absolutePopup');
    if (!popup) return;
    
    const hearts = ['💖', '💕', '💗', '💓', '💝', '💘', '💞'];
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: absolute !important;
            font-size: ${Math.random() * 25 + 20}px !important;
            left: ${Math.random() * 100}% !important;
            top: 100% !important;
            pointer-events: none !important;
            animation: floatUp ${3 + Math.random() * 2}s ease-out forwards !important;
            animation-delay: ${Math.random() * 2}s !important;
            z-index: 100000 !important;
        `;
        
        popup.appendChild(heart);
        
        // Remover después de la animación
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 6000);
    }
    
    // Agregar animación de corazones flotantes
    const heartCSS = `
        <style>
            @keyframes floatUp {
                0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(0.5); }
                20% { opacity: 1; transform: translateY(-100px) rotate(180deg) scale(1); }
                80% { opacity: 1; transform: translateY(-400px) rotate(300deg) scale(1.2); }
                100% { opacity: 0; transform: translateY(-600px) rotate(360deg) scale(0.8); }
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', heartCSS);
}

function createRomanticHearts() {
    const popup = document.getElementById('finalPopup');
    const heartCount = 20;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = ['💖', '💕', '💗', '💓', '💝'][Math.floor(Math.random() * 5)];
        heart.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            left: ${Math.random() * 100}%;
            top: 100%;
            pointer-events: none;
            animation: romanticFloat ${3 + Math.random() * 2}s ease-out forwards;
            animation-delay: ${Math.random() * 2}s;
            z-index: 1001;
        `;
        
        popup.appendChild(heart);
        
        // Remover el corazón después de la animación
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 5000 + (Math.random() * 1000));
    }
}

// Agregar animación de corazones románticos al CSS dinámicamente
const romanticCSS = `
@keyframes romanticFloat {
    0% {
        opacity: 0;
        transform: translateY(0) rotate(0deg) scale(0.5);
    }
    20% {
        opacity: 1;
        transform: translateY(-100px) rotate(180deg) scale(1);
    }
    80% {
        opacity: 1;
        transform: translateY(-400px) rotate(300deg) scale(1.2);
    }
    100% {
        opacity: 0;
        transform: translateY(-500px) rotate(360deg) scale(0.8);
    }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

const romanticStyle = document.createElement('style');
romanticStyle.textContent = romanticCSS;
document.head.appendChild(romanticStyle);

// ===== UTILIDADES =====
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.src) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
}

// Precargar imágenes cuando se carga la página
document.addEventListener('DOMContentLoaded', preloadImages);

// Manejar errores de carga de medios
function handleMediaErrors() {
    const images = document.querySelectorAll('img');
    const videos = document.querySelectorAll('video');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`No se pudo cargar la imagen: ${this.src}`);
            this.style.opacity = '0.5';
            this.alt = 'Imagen no disponible';
        });
    });
    
    videos.forEach(video => {
        video.addEventListener('error', function() {
            console.warn(`No se pudo cargar el video: ${this.src}`);
            this.style.display = 'none';
        });
    });
}

document.addEventListener('DOMContentLoaded', handleMediaErrors);

// ===== EFECTOS ESPECIALES =====
function addSparkleEffect(element) {
    // Crear efecto de brillos
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ff6b9d;
            border-radius: 50%;
            pointer-events: none;
            animation: sparkle 1s ease-out forwards;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        element.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// Agregar animación de sparkle al CSS dinámicamente
const sparkleCSS = `
@keyframes sparkle {
    0% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
    }
    50% {
        opacity: 1;
        transform: scale(1) rotate(180deg);
    }
    100% {
        opacity: 0;
        transform: scale(0) rotate(360deg);
    }
}
`;

const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);

console.log('💖 Regalo de aniversario listo para Elen');
console.log('🎮 Funciones disponibles: showScreen(), addSparkleEffect()');

// Fallback para jQuery si no está disponible
if (typeof $ === 'undefined') {
    window.$ = function(selector) {
        const element = document.querySelector(selector);
        return {
            turn: function() {
                console.warn('Turn.js no está disponible');
                return null;
            }
        };
    };
}