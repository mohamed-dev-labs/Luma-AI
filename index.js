#!/usr/bin/env node

const { Command } = require('commander');
const QRCode = require('qrcode');
const ImageEngine = require('./engine');
const path = require('path');
const fs = require('fs');

const program = new Command();

program
  .name('code-imagine')
  .description('أداة لتوليد الصور عبر المعادلات الرياضية ورموز QR')
  .version('1.0.0');

program
  .command('generate')
  .description('توليد صورة بناءً على وصف نصي')
  .argument('<prompt>', 'الوصف النصي للصورة')
  .option('-o, --output <path>', 'مسار حفظ الصورة', 'output.png')
  .action(async (prompt, options) => {
    console.log(`🎨 جاري معالجة الوصف: "${prompt}"...`);
    
    try {
      const engine = new ImageEngine();
      const buffer = engine.generate(prompt);
      const outputPath = path.resolve(process.cwd(), options.output);
      
      await engine.save(buffer, outputPath);
      console.log(`✅ تم حفظ الصورة في: ${outputPath}`);

      // توليد QR Code يحتوي على مسار الملف (أو يمكن رفعه لاحقاً)
      // في هذه المرحلة، سنضع مسار الملف المحلي في الـ QR
      const qrPath = outputPath.replace('.png', '-qr.png');
      const fileUrl = `file://${outputPath}`;
      
      await QRCode.toFile(qrPath, fileUrl);
      console.log(`📱 تم توليد رمز QR في: ${qrPath}`);
      console.log(`💡 امسح الرمز لعرض مسار الصورة (ملاحظة: الرمز يحتوي على مسار محلي حالياً)`);

    } catch (error) {
      console.error('❌ حدث خطأ أثناء التوليد:', error.message);
    }
  });

program.parse();
