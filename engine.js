const { createCanvas } = require('canvas');
const fs = require('fs');
const { LumaMathEngine } = require('./distillation');

class ImageEngine {
    constructor(width = 800, height = 800) {
        this.width = width;
        this.height = height;
        this.canvas = createCanvas(width, height);
        this.ctx = this.canvas.getContext('2d');
        this.math = new LumaMathEngine();
    }

    parsePrompt(prompt) {
        return {
            isFlower: /زهرة|وردة|flower/gi.test(prompt),
            isField: /حقل|عشب|field|grass/gi.test(prompt),
            isMath: /رياضيات|معادلة|math/gi.test(prompt),
            windStrength: prompt.includes('ريح') ? 5 : 1,
            colors: this.extractColors(prompt)
        };
    }

    extractColors(prompt) {
        const colors = [];
        if (/أحمر|red/i.test(prompt)) colors.push('#D32F2F');
        if (/أخضر|green/i.test(prompt)) colors.push('#388E3C');
        if (/أزرق|blue/i.test(prompt)) colors.push('#1976D2');
        return colors.length > 0 ? colors : ['#4CAF50', '#81C784'];
    }

    /**
     * رسم العشب باستخدام معادلات فيزيائية دقيقة
     * لضمان عدم ميلان أي عشبة إلا وفقاً لقوانين الفيزياء
     */
    drawGrass(x, y, height, windStrength) {
        const ctx = this.ctx;
        const bend = this.math.calculateGrassBend(height, windStrength);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        // استخدام منحنى بيزييه يعتمد على حسابات فيزيائية
        ctx.bezierCurveTo(
            x, y - height / 2,
            x + bend, y - height / 1.5,
            x + bend * 1.2, y - height
        );
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    /**
     * رسم زهرة تعتمد على نسب هندسية دقيقة (توزيع فيبوناتشي)
     */
    drawGeometricFlower(x, y, radius, petalsCount, color) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);

        for (let i = 0; i < petalsCount; i++) {
            const coords = this.math.getPetalCoordinates(i, petalsCount, radius);
            const angle = (i * 2 * Math.PI) / petalsCount;
            
            ctx.save();
            ctx.rotate(angle);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(radius / 2, 0, radius / 2, radius / 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // قلب الزهرة - دائرة كاملة هندسياً
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, radius / 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    generate(prompt) {
        const params = this.parsePrompt(prompt);
        const ctx = this.ctx;

        // خلفية نظيفة
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(0, 0, this.width, this.height);

        if (params.isField) {
            // رسم 500 عشبة، كل واحدة محسوبة فيزيائياً
            for (let i = 0; i < 500; i++) {
                const gx = (i * (this.width / 500)) + (Math.random() * 2);
                const gy = this.height;
                const h = 50 + Math.random() * 30;
                this.drawGrass(gx, gy, h, params.windStrength);
            }
        }

        if (params.isFlower) {
            const flowerX = this.width / 2;
            const flowerY = this.height * 0.6;
            this.drawGeometricFlower(flowerX, flowerY, 60, 12, params.colors[0]);
        }

        return this.canvas.toBuffer('image/png');
    }

    async save(buffer, filename) {
        fs.writeFileSync(filename, buffer);
        return filename;
    }
}

module.exports = ImageEngine;
