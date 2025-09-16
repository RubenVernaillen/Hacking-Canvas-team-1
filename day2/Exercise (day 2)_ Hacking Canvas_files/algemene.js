
const container = document.querySelector('div.team-1\\.2');

if (container) {

    container.classList.add('team-1.2-container');


    const canvas = document.createElement('canvas');
    canvas.classList.add('team-1.2-canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');


    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);


    class Star {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.radius = Math.random() * 1.5 + 0.5;
            this.speed = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
            ctx.fill();
        }
        update() {
            this.y += this.speed;
            this.opacity += this.twinkleSpeed;
            if (this.opacity >= 1 || this.opacity <= 0.3) this.twinkleSpeed *= -1;
            if (this.y > canvas.height) this.reset();
        }
    }


    const stars = [];
    const STAR_COUNT = 100;
    for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());


    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(animate);
    }

    animate();
}
