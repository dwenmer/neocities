/**
 * Crossroads Interactive Starfield Logic v2.0
 * Generiert 3 zufällige, interaktive Buttons ohne Überlappung.
 */

// Konfiguration der drei Buttons (unverändert)
const starData = [
    { text: "Experience Crossroads", url: "https://roton.me/nexus" },
    { text: "Listen to the Static", url: "https://roton.me/logs" },
    { text: "Read the Archives", url: "archives.html" },
    { text: "Visit the Ancient Gods", url: "oldgods.html" },
    { text: "Meet the Creator", url: "contact.html" }
];

// Konfiguration des Himmels und der Platzierung
const config = {
    // Definition der Safe-Zone (in % des Containers)
    safeZone: {
        minX: 10, maxX: 90, 
        minY: 20, maxY: 80  
    },
    // Minimale Distanz, die Sterne voneinander haben müssen (in Prozent)
    minDist: 15,
    // Maximale Versuche, einen gültigen Platz zu finden
    maxAttempts: 100 
};

/**
 * Kernfunktion: Berechnet Zufallspositionen ohne Kollision.
 * Gibt ein Array mit {x, y} Koordinaten zurück.
 */
function calculateNonOverlappingPositions(numStars) {
    const positions = [];
    const containerSize = { width: window.innerWidth, height: window.innerHeight };

    for (let i = 0; i < numStars; i++) {
        let valid = false;
        let attempts = 0;
        let posX, posY;

        // "Brute Force" Platzfindungsschleife
        while (!valid && attempts < config.maxAttempts) {
            attempts++;

            // Zufallskoordinaten erzeugen
            posX = Math.random() * (config.safeZone.maxX - config.safeZone.minX) + config.safeZone.minX;
            posY = Math.random() * (config.safeZone.maxY - config.safeZone.minY) + config.safeZone.minY;

            // Prüfen, ob dies der erste Stern ist (keine Kollision möglich)
            if (positions.length === 0) {
                valid = true;
                break;
            }

            // Distanz zu JEDEM bereits platzierten Stern prüfen
            // Da wir mit Prozentwerten arbeiten, müssen wir die Entfernungsklasse
            // basierend auf den Prozentdifferenzen berechnen.
            valid = positions.every(pos => {
                const diffX = Math.abs(pos.x - posX);
                const diffY = Math.abs(pos.y - posY);
                
                // Wir nutzen hier eine vereinfachte, box-basierte Distanzprüfung.
                // Ein Stern muss mindestens config.minDist entfernt sein.
                // Das ist performanter als die echte euklidische Distanz (Pythagoras).
                return diffX > config.minDist || diffY > config.minDist;
            });
        }

        if (valid) {
            positions.push({ x: posX, y: posY });
        } else {
            console.warn(`System-Divergenz: Konnte für Stern ${i+1} keinen gültigen Platz nach ${config.maxAttempts} Versuchen finden.`);
            // Fallback: Wenn wir keinen Platz finden, platzieren wir ihn trotzdem (Überlappung akzeptieren)
            positions.push({ x: posX, y: posY }); 
        }
    }
    return positions;
}

/**
 * Initialisierungs-Funktion
 */
function initializeStars() {
    const container = document.getElementById('starfield-container');
    const isTouchDevice = 'ontouchstart' in window;

    // 1. Die 3 gültigen Positionen berechnen
    const positions = calculateNonOverlappingPositions(starData.length);

    // 2. DOM-Elemente basierend auf den Positionen erstellen
    for (let i = 0; i < starData.length; i++) {
        const anchor = document.createElement('a');
        anchor.className = 'star-anchor';
        anchor.href = starData[i].url;
        anchor.target = "_self"; 
        
        // Position aus dem berechneten Array zuweisen
        anchor.style.left = `${positions[i].x}%`;
        anchor.style.top = `${positions[i].y}%`;

        const circle = document.createElement('div');
        circle.className = 'star-reveal-circle';

        const span = document.createElement('span');
        span.className = 'star-text';
        span.textContent = starData[i].text;

        anchor.appendChild(circle);
        anchor.appendChild(span);

        // Touch-Logik (unverändert)
        if (isTouchDevice) {
            anchor.addEventListener('touchstart', function(e) {
                resetAllStars();
                this.classList.add('is-touched');
            });
        }

        // In den Himmel injizieren
        container.appendChild(anchor);
    }
}

/**
 * Hilfsfunktion zum Zurücksetzen (unverändert)
 */
function resetAllStars() {
    document.querySelectorAll('.star-anchor').forEach(star => {
        star.classList.remove('is-touched');
    });
}

// Starten, sobald das DOM bereit ist
document.addEventListener('DOMContentLoaded', initializeStars);

/**
 * Ancient Gods Shrine Logic
 * Generiert interaktive Kerne in der Lichtsäule.
 */

// Konfiguration der "Götter" (Daten)
const godData = [
    { name: "Creator 01", title: "THE ARCHITECT", text: "Inspired the Neural Net interface and the concept of crossroads.", img: "imgs/oldgods.jpg" },
    { name: "Creator 01", title: "THE ARCHITECT", text: "Inspired the Neural Net interface and the concept of crossroads.", img: "imgs/oldgods.jpg" },
    { name: "Creator 01", title: "THE ARCHITECT", text: "Inspired the Neural Net interface and the concept of crossroads.", img: "imgs/oldgods.jpg" },
    { name: "Creator 01", title: "THE ARCHITECT", text: "Inspired the Neural Net interface and the concept of crossroads.", img: "imgs/oldgods.jpg" },
    { name: "Creator 01", title: "THE ARCHITECT", text: "Inspired the Neural Net interface and the concept of crossroads.", img: "imgs/oldgods.jpg" },
    { name: "Creator 01", title: "THE ARCHITECT", text: "Inspired the Neural Net interface and the concept of crossroads.", img: "imgs/oldgods.jpg" },
    { name: "Creator 01", title: "THE ARCHITECT", text: "Inspired the Neural Net interface and the concept of crossroads.", img: "imgs/oldgods.jpg" },
    { name: "Medienkollektiv 'VOID'", title: "CYBERPUNK PARALLAX", text: "Defined the static-audio aesthetic and deep-space vibe.", img: "imgs/oldgods.jpg" },
    { name: "D. Wenmer", title: "STASIS TRANSMITTER", text: "The primary operational voice for this channel.", img: "imgs/oldgods.jpg" }
    // Weitere Einträge hier hinzufügen...
];

function initializeAncientGods() {
    const beam = document.getElementById('shrine-beam');
    const modal = document.getElementById('god-info-modal');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.querySelector('.modal-close');

    // Nur innerhalb des schmalen Beams positionieren
    // Wir benötigen keine Safe Zone, da der Beam schmal ist.
   for (let i = 0; i < godData.length; i++) {
    let posX, posY;
    let isValid = false;

    // Schleife läuft, bis eine Position AUẞERHALB des Knochens gefunden wird
    while (!isValid) {
        posX = Math.random() * 60 + 20; // 20% bis 80% Breite
        posY = Math.random() * 90 + 5;  // 5% bis 95% Höhe

        // PRÜFUNG: Liegt der Punkt im Knochen-Bereich (z.B. zwischen 35% und 55%)?
        if (posY < 35 || posY > 55) {
            isValid = true; // Position ist im Licht (oben oder unten), also gültig
        }
    }

    const core = document.createElement('div');
    core.className = 'god-core';
    core.style.left = `${posX}%`;
    core.style.top = `${posY}%`;
        core.title = godData[i].name; // Tooltip beim Hover

        // 2. Klick-Event für das Modal
        core.addEventListener('click', () => {
            // Inhalt für das Modal zusammensetzen
            modalContent.innerHTML = `
                <div style="display: flex; gap: 20px;">
                    <img src="${godData[i].img}" alt="${godData[i].name}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover;">
                    <div>
                        <h3 style="color: #ffcc00; font-family: 'Courier New', monospace; letter-spacing: 3px;">${godData[i].title}</h3>
                        <h4 style="color: #fff; margin-bottom: 10px;">${godData[i].name}</h4>
                        <p style="color: #bbb; line-height: 1.6;">${godData[i].text}</p>
                    </div>
                </div>
            `;
            // Modal sichtbar machen
            modal.classList.remove('modal-hidden');
            modal.classList.add('modal-visible');
        });

        // In den Beam injizieren
        beam.appendChild(core);
    }

    // Modal schließen Events
    closeBtn.addEventListener('click', () => {
        modal.classList.add('modal-hidden');
        modal.classList.remove('modal-visible');
    });

    modal.addEventListener('click', (e) => {
        // Schließen, wenn man außerhalb des Frames klickt
        if (e.target === modal) {
            modal.classList.add('modal-hidden');
            modal.classList.remove('modal-visible');
        }
    });
}

// Starten, sobald das DOM bereit ist
document.addEventListener('DOMContentLoaded', initializeAncientGods);