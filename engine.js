const { createCanvas } = require('canvas');
const fs = require('fs');

class ImageEngine {
    constructor(width = 400, height = 400) { // تقليل الحجم ليتناسب مع ضغط QR
        this.width = width;
        this.height = height;
        this.canvas = createCanvas(width, height);
        this.ctx = this.canvas.getContext('2d');
    }

    parsePrompt(prompt) {
        const params = {
            complexity: (prompt.match(/معقد|تفاصيل|complex|detail/gi) || []).length > 0 ? 20 : 5,
            shapes: (prompt.match(/دوائر|مربعات|مثلثات|shapes/gi) || []).length > 0 ? 'mixed' : 'circles',
            colorPalette: this.extractColors(prompt),
            pattern: prompt.includes('شبكة') || prompt.includes('grid') ? 'grid' : 'random'
        };
        return params;
    }

    extractColors(prompt) {
        const colors = [];
        if (prompt.includes('أحمر') || prompt.includes('red')) colors.push('#FF0000');
        if (prompt.includes('أزرق') || prompt.includes('blue')) colors.push('#0000FF');
        if (prompt.includes('أخضر') || prompt.includes('green')) colors.push('#00FF00');
        if (prompt.includes('أصفر') || prompt.includes('yellow')) colors.push('#FFFF00');
        if (prompt.includes('بنفسجي') || prompt.includes('purple')) colors.push('#800080');
        return colors.length > 0 ? colors : ['#000000', '#333333'];
    }

    generate(prompt) {
        const params = this.parsePrompt(prompt);
        const ctx = this.ctx;

        // خلفية متدرجة
        const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f0f0f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < params.complexity * 10; i++) {
            ctx.strokeStyle = params.colorPalette[i % params.colorPalette.length];
            ctx.globalAlpha = 0.6;
            ctx.lineWidth = Math.random() * 3;

            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = Math.random() * 50;

            if (params.shapes === 'mixed') {
                const type = Math.floor(Math.random() * 3);
                if (type === 0) {
                    ctx.strokeRect(x, y, size, size);
                } else if (type === 1) {
                    ctx.beginPath();
                    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + size, y);
                    ctx.lineTo(x + size / 2, y - size);
                    ctx.closePath();
                    ctx.stroke();
                }
            } else {
                // نمط رياضي معقد (Spirograph style)
                const angle = i * 0.2;
                const r = (Math.sin(angle * 3) * 100) + 150;
                const px = Math.cos(angle) * r + this.width / 2;
                const py = Math.sin(angle) * r + this.height / 2;
                
                ctx.beginPath();
                ctx.arc(px, py, Math.abs(Math.cos(i) * 10), 0, Math.PI * 2);
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
