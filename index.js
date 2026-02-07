#!/usr/bin/env node

const { Command } = require('commander');
const QRCode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const ImageEngine = require('./engine');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const program = new Command();

program
  .name('code-imagine')
  .description('أداة لتوليد الصور عبر المعادلات الرياضية ورموز QR المدمجة')
  .version('1.1.0');

program
  .command('generate')
  .description('توليد صورة وضغطها داخل رمز QR')
  .argument('<prompt>', 'الوصف النصي للصورة')
  .option('-o, --output <path>', 'مسار حفظ الصورة الأصلية', 'output.png')
  .action(async (prompt, options) => {
    console.log(`\n🎨 جاري معالجة الوصف المعقد: "${prompt}"...`);
    
    try {
      const engine = new ImageEngine(300, 300); // حجم أصغر للضغط
      const buffer = engine.generate(prompt);
      const outputPath = path.resolve(process.cwd(), options.output);
      
      await engine.save(buffer, outputPath);
      console.log(`✅ تم حفظ الصورة الأصلية في: ${outputPath}`);

      // ضغط الصورة بشكل كبير لتناسب الـ QR Code
      // سنقوم بتحويلها إلى JPEG بجودة منخفضة وحجم صغير جداً
      const compressedBuffer = await sharp(buffer)
        .resize(50, 50) // تصغير الأبعاد جداً
        .jpeg({ quality: 20 })
        .toBuffer();

      const base64Image = compressedBuffer.toString('base64');
      
      // إنشاء HTML بسيط لعرض الصورة مع خيارات المشاركة
      // ملاحظة: الـ QR سيحتوي على Data URI للصورة مباشرة
      const dataUri = `data:image/jpeg;base64,${base64Image}`;
      
      console.log(`\n📱 رمز QR المولد (يحتوي على بيانات الصورة مضغوطة):`);
      
      // عرض الرمز في التيرمينال
      qrcodeTerminal.generate(dataUri, { small: true });

      console.log(`\n💡 معلومات الأمان:`);
      console.log(`- هذا الرمز يحتوي على بيانات الصورة مباشرة (Base64).`);
      console.log(`- لا يتم إرسال أي بيانات لخوادم خارجية، العملية محلية بالكامل وآمنة 100%.`);
      console.log(`- عند مسح الرمز، سيظهر لك رابط "data:image..."، يمكنك فتحه في المتصفح لرؤية الصورة.`);

    } catch (error) {
      console.error('❌ حدث خطأ:', error.message);
    }
  });

program.parse();
