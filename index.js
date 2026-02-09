#!/usr/bin/env node

const { Command } = require('commander');
const displayLogo = require('./logo');
const ImageEngine = require('./engine');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const program = new Command();

program
  .name('luma-ai')
  .description('Luma AI: محرك توليد صور محلي يعتمد على التقطير المعرفي والمعادلات الرياضية والفيزيائية')
  .version('2.0.0');

// أمر التدريب (التقطير)
program
  .command('train')
  .description('بدء عملية التقطير المعرفي لتدريب النموذج المحلي')
  .action(async () => {
    console.log("🧠 جاري تشغيل أنبوبة التقطير لـ Luma AI...");
    try {
        require('./train');
    } catch (error) {
        console.error("❌ خطأ أثناء التدريب:", error.message);
    }
  });

// أمر التوليد المطور
program
  .command('generate')
  .description('توليد صورة بدقة هندسية وجبرية')
  .argument('<prompt>', 'الوصف النصي (يدعم المسائل الرياضية والفيزيائية)')
  .option('-o, --output <path>', 'مسار حفظ الصورة', 'luma_output.png')
  .action(async (prompt, options) => {
    console.log(`\n🚀 Luma AI يقوم بحساب الأبعاد والفيزياء لـ: "${prompt}"...`);
    
    try {
      const engine = new ImageEngine(800, 800);
      const buffer = engine.generate(prompt);
      const outputPath = path.resolve(process.cwd(), options.output);
      
      await engine.save(buffer, outputPath);
      console.log(`✅ تم الحساب والتوليد بنجاح!`);
      console.log(`📍 الملف محفوظ في: ${outputPath}`);
      console.log(`📐 ملاحظة: تم استخدام المعادلات الجبرية والفيزيائية لضمان عدم ميلان أي عنصر عن مكانه.`);

    } catch (error) {
      console.error('❌ حدث خطأ في المحرك الرياضي:', error.message);
    }
  });

if (process.argv.length <= 2) {
  displayLogo();
  program.help();
}

program.parse();
