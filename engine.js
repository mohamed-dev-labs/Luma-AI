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
            isComplex: /معقد|تفاصيل|دقيق|realistic/gi.test(prompt),
            colors: this.extractColors(prompt)
        };
    }

    extractColors(prompt) {
        const colors = [];
        if (/أحمر|red/i.test(prompt)) colors.push('#D32F2F');
        if (/أخضر|green/i.test(prompt)) colors.push('#388E3C');
        if (/أزرق|blue/i.test(prompt)) colors.push('#1976D2');
        if (/أصفر|yellow/i.test(prompt)) colors.push('#FBC02D');
        if (/بني|brown/i.test(prompt)) colors.push('#5D4037');
        return colors.length > 0 ? colors : ['#424242', '#616161'];
    }

    drawFlower(x, y, size, color) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        
        // ظل الزهرة
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 3;

        // البتلات مع تدرج لوني للواقعية
        for (let i = 0; i < 8; i++) {
            ctx.rotate(Math.PI / 4);
            const grad = ctx.createRadialGradient(size, 0, 0, size, 0, size);
            grad.addColorStop(0, color);
            grad.addColorStop(1, this.adjustColor(color, -20));
            ctx.fillStyle = grad;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(size, -size/2, size*1.5, size/2, 0, 0);
            ctx.fill();
            
            // عروق البتلة
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(size, 0);
            ctx.stroke();
        }
        
        // قلب الزهرة مع تفاصيل (حبوب اللقاح)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#B8860B';
        for(let j=0; j<10; j++) {
            const rx = (Math.random()-0.5)*size/3;
            const ry = (Math.random()-0.5)*size/3;
            ctx.beginPath();
            ctx.arc(rx, ry, 1, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.restore();
    }

    drawDog(x, y, scale) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        // ظل الكلب
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;

        // الجسم مع تدرج فرو
        const bodyGrad = ctx.createLinearGradient(-40, 0, 40, 0);
        bodyGrad.addColorStop(0, '#8B4513');
        bodyGrad.addColorStop(1, '#A0522D');
        ctx.fillStyle = bodyGrad;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, 45, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // الرأس
        ctx.beginPath();
        ctx.arc(40, -20, 22, 0, Math.PI * 2);
        ctx.fill();

        // الأذنين (أكثر تفصيلاً)
        ctx.beginPath();
        ctx.moveTo(30, -35);
        ctx.quadraticCurveTo(20, -50, 15, -30);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(50, -35);
        ctx.quadraticCurveTo(60, -50, 65, -30);
        ctx.fill();

        // ملامح الوجه (العيون والأنف) - الدقة المطلوبة
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(33, -25, 4, 0, Math.PI * 2);
        ctx.arc(47, -25, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(34, -25, 2, 0, Math.PI * 2);
        ctx.arc(46, -25, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // الأنف
        ctx.beginPath();
        ctx.arc(40, -15, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // الفم
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(37, -10);
        ctx.quadraticCurveTo(40, -7, 43, -10);
        ctx.stroke();

        // الأرجل
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-35, 20, 10, 25);
        ctx.fillRect(15, 20, 10, 25);
        
        // الذيل
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-45, 0);
        ctx.quadraticCurveTo(-65, -30, -50, -45);
        ctx.stroke();
        
        ctx.restore();
    }

    adjustColor(color, amount) {
        return color; // تبسيط للنموذج الحالي
    }

    generate(prompt) {
        const params = this.parsePrompt(prompt);
        const ctx = this.ctx;

        // سماء واقعية مع تدرج
        const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        skyGrad.addColorStop(0, '#2196F3');
        skyGrad.addColorStop(1, '#BBDEFB');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // شمس
        ctx.fillStyle = '#FFF176';
        ctx.shadowColor = '#FFF176';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(this.width - 60, 60, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (params.isField) {
            // عشب بتدرج
            const grassGrad = ctx.createLinearGradient(0, this.height * 0.6, 0, this.height);
            grassGrad.addColorStop(0, '#4CAF50');
            grassGrad.addColorStop(1, '#1B5E20');
            ctx.fillStyle = grassGrad;
            ctx.fillRect(0, this.height * 0.6, this.width, this.height * 0.4);
            
            // رسم عشب كثيف بتفاصيل
            for (let i = 0; i < 200; i++) {
                const gx = Math.random() * this.width;
                const gy = this.height * 0.6 + Math.random() * 150;
                ctx.strokeStyle = '#2E7D32';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(gx, gy);
                ctx.quadraticCurveTo(gx + 2, gy - 15, gx - 2, gy - 25);
                ctx.stroke();
            }
        }

        if (params.isFlower) {
            for (let i = 0; i < 12; i++) {
                const fx = Math.random() * this.width;
                const fy = this.height * 0.65 + Math.random() * 100;
                this.drawFlower(fx, fy, 8 + Math.random() * 7, params.colors[i % params.colors.length]);
            }
        }

        if (params.isDog) {
            this.drawDog(this.width / 2, this.height * 0.75, 0.9);
        }

        return this.canvas.toBuffer('image/png');
    }

    async save(buffer, filename) {
        fs.writeFileSync(filename, buffer);
        return filename;
    }
}

module.exports = ImageEngine;
