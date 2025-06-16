// --- SCRIPT PARA ANIMAÇÃO DE PARTÍCULAS NO CANVAS ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Ajusta o tamanho do canvas para preencher a janela
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Propriedades das partículas
const particleProps = {
    color: 'rgba(255, 255, 255, 0.5)',
    minRadius: 0.5,
    maxRadius: 2.5,
    lineDistance: 120,
    particleCount: 100
};

// Classe para criar cada partícula
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // Desenha a partícula no canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // Atualiza a posição da partícula
    update() {
        // Inverte a direção se a partícula atingir a borda do canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        // Move a partícula
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Cria o array de partículas
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    if (numberOfParticles > particleProps.particleCount) {
        numberOfParticles = particleProps.particleCount;
    }
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * (particleProps.maxRadius - particleProps.minRadius)) + particleProps.minRadius;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = particleProps.color;
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Desenha as linhas que conectam as partículas próximas
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / (particleProps.lineDistance * 100));
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Ajusta o canvas se a janela for redimensionada
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// Inicia a animação
init();
animate();


// --- SCRIPT PARA ANIMAÇÃO DE FADE-IN AO ROLAR A PÁGINA ---
document.addEventListener("DOMContentLoaded", function() {
    const fadeInElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    fadeInElements.forEach(el => {
        observer.observe(el);
    });
});
