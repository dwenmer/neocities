/**
 * Crossroads Interactive Starfield Logic v2.0
 * Generiert 3 zufällige, interaktive Buttons ohne Überlappung.
 */

// Konfiguration der drei Buttons (unverändert)
const starData = [
    { text: "Experience Crossroads", url: "https://roton.me/nexus" },
    { text: "Listen to the Static", url: "https://roton.me/logs" },
    { text: "Meet the Creator", url: "https://roton.me/stream" }
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
    const positions = calculateNonOverlappingPositions(3);

    // 2. DOM-Elemente basierend auf den Positionen erstellen
    for (let i = 0; i < 3; i++) {
        const anchor = document.createElement('a');
        anchor.className = 'star-anchor';
        anchor.href = starData[i].url;
        anchor.target = "_blank"; 
        
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