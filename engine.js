const { createCanvas } = require('canvas');
const fs = require('fs');

class ImageEngine {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.canvas = createCanvas(width, height);
        this.ctx = this.canvas.getContext('2d');
    }

    parsePrompt(prompt) {
        return {
            isFlower: /زهرة|وردة|flower/gi.test(prompt),
            isField: /حقل|عشب|field|grass/gi.test(prompt),
            isDog: /كلب|حيوان|dog|animal/gi.test(prompt),
            isComplex: /معقد|تفاصيل|complex/gi.test(prompt),
            colors: this.extractColors(prompt)
        };
    }

    extractColors(prompt) {
        const colors = [];
        if (/أحمر|red/i.test(prompt)) colors.push('#FF5555');
        if (/أخضر|green/i.test(prompt)) colors.push('#55FF55');
        if (/أزرق|blue/i.test(prompt)) colors.push('#5555FF');
        if (/أصفر|yellow/i.test(prompt)) colors.push('#FFFF55');
        if (/بني|brown/i.test(prompt)) colors.push('#8B4513');
        return colors.length > 0 ? colors : ['#333', '#666'];
    }

    drawFlower(x, y, size, color) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = color;
        for (let i = 0; i < 8; i++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath();
            ctx.ellipse(size, 0, size, size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawGrass(x, y, height) {
        const ctx = this.ctx;
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + 5, y - height / 2, x, y - height);
        ctx.stroke();
    }

    drawDog(x, y, scale) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = '#8B4513';
        // Body (Ellipse)
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        // Head
        ctx.beginPath();
        ctx.arc(35, -15, 20, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.beginPath();
        ctx.ellipse(25, -25, 10, 5, Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
        // Legs
        ctx.fillRect(-30, 15, 8, 20);
        ctx.fillRect(10, 15, 8, 20);
        // Tail
        ctx.beginPath();
        ctx.moveTo(-40, 0);
        ctx.quadraticCurveTo(-55, -20, -45, -30);
        ctx.stroke();
        ctx.restore();
    }

    generate(prompt) {
        const params = this.parsePrompt(prompt);
        const ctx = this.ctx;

        // Background
        const skyGradient = ctx.createLinearGradient(0, 0, 0, this.height);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.width, this.height);

        if (params.isField) {
            ctx.fillStyle = '#7CFC00';
            ctx.fillRect(0, this.height * 0.7, this.width, this.height * 0.3);
            for (let i = 0; i < 100; i++) {
                this.drawGrass(Math.random() * this.width, this.height * 0.7 + Math.random() * 100, 10 + Math.random() * 20);
            }
        }

        if (params.isFlower) {
            const count = params.isComplex ? 15 : 5;
            for (let i = 0; i < count; i++) {
                const x = Math.random() * this.width;
                const y = params.isField ? (this.height * 0.7 + Math.random() * 50) : (Math.random() * this.height);
                this.drawFlower(x, y, 10 + Math.random() * 10, params.colors[i % params.colors.length]);
            }
        }

        if (params.isDog) {
            this.drawDog(this.width / 2, this.height * 0.7, 1.0);
        }

        // Abstract Math Layer if nothing specific
        if (!params.isFlower && !params.isField && !params.isDog) {
            for (let i = 0; i < 50; i++) {
                ctx.strokeStyle = params.colors[i % params.colors.length];
                ctx.beginPath();
                const t = i * 0.5;
                const x = this.width/2 + Math.cos(t) * t * 10;
                const y = this.height/2 + Math.sin(t) * t * 10;
                ctx.arc(x, y, Math.abs(Math.sin(i)*20), 0, Math.PI*2);
                ctx.stroke();
            }
        }

        return this.canvas.toBuffer('image/png');
    }

    async save(buffer, filename) {
        fs.writeFileSync(filename, buffer);
        return filename;
    }
}

module.exports = ImageEngine;
