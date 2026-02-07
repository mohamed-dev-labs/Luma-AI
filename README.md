# CodeImagine 🎨

**CodeImagine** هي أداة CLI مبتكرة مبنية باستخدام Node.js تقوم بتوليد صور فنية بناءً على معادلات رياضية وأبعاد مستوحاة من الأوصاف النصية، مع ميزة توليد رمز QR لعرض النتيجة.

## المميزات ✨
- **توليد صور محلي**: لا حاجة لاتصال بالإنترنت لتوليد الأشكال الأساسية.
- **محرك رياضي**: يعتمد على تحويل الكلمات المفتاحية إلى معادلات هندسية.
- **تكامل QR Code**: توليد تلقائي لرمز QR يربطك بالصورة المولدة.
- **سهولة الاستخدام**: واجهة سطر أوامر بسيطة وسريعة.

## التثبيت 🚀
```bash
# استنساخ المستودع
git clone https://github.com/YOUR_USERNAME/code-imagine.git
cd code-imagine

# تثبيت الاعتمادات
npm install

# تثبيت الأداة عالمياً
npm link
```

## الاستخدام 🛠️
لتوليد صورة جديدة، استخدم الأمر التالي:
```bash
code-imagine generate "دائرة حمراء كبيرة مع مربعات زرقاء" --output my-art.png
```

## كيف يعمل؟ 🤔
تقوم الأداة بتحليل الوصف النصي واستخراج الأشكال والألوان المطلوبة، ثم تقوم بتطبيق معادلات رياضية (مثل Sin/Cos) لتوزيع الأشكال هندسياً على اللوحة (Canvas)، وفي النهاية يتم إنشاء رمز QR يحتوي على مسار الصورة.

---

# CodeImagine (English) 🎨

**CodeImagine** is an innovative CLI tool built with Node.js that generates artistic images based on mathematical equations and dimensions derived from text prompts, featuring automatic QR code generation.

## Features ✨
- **Local Generation**: No internet required for core shape generation.
- **Math Engine**: Converts keywords into geometric equations.
- **QR Code Integration**: Automatically generates a QR code linked to your image.
- **User Friendly**: Simple and fast command-line interface.

## Installation 🚀
```bash
npm install
npm link
```

## Usage 🛠️
```bash
code-imagine generate "large red circle with blue squares" --output my-art.png
```

## License 📄
MIT
