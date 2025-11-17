// المتغيرات والدوال المساعدة (calculateCheckDigit, generateUniqueEAN13) تبقى كما هي

let generatedCodes = new Set();
let currentBarcodeNumber = ''; 

// دالة حساب رقم التحقق (تبقى كما هي)
function calculateCheckDigit(digits) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(digits.charAt(i));
        if ((i + 1) % 2 === 0) {
            sum += digit * 3;
        } else {
            sum += digit * 1;
        }
    }
    let remainder = sum % 10;
    return (10 - remainder) % 10;
}

// دالة توليد الباركود (تم التعديل عليها)
function generateUniqueEAN13() {
    let fullBarcode;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        // 1. نبدأ سلسلة الأرقام بالرقم الثابت 6.
        let digits12 = '6'; 
        
        // 2. نستمر في توليد 11 رقمًا عشوائيًا (من i = 1 إلى i < 12)
        for (let i = 1; i < 12; i++) {
            digits12 += Math.floor(Math.random() * 10).toString();
        }
        
        // 3. يتم حساب رقم التحقق بشكل طبيعي بناءً على الـ 12 رقمًا، والتي تبدأ الآن بـ 6.
        const checkDigit = calculateCheckDigit(digits12);
        fullBarcode = digits12 + checkDigit.toString();
        attempts++;
        if (attempts >= maxAttempts) {
            console.error("فشل في توليد باركود فريد.");
            break;
        }
    } while (generatedCodes.has(fullBarcode));

    generatedCodes.add(fullBarcode);
    currentBarcodeNumber = fullBarcode;
    return fullBarcode;
}

// دالة رسم الباركود (تبقى كما هي)
function generateNewBarcode() {
    const newCode = generateUniqueEAN13();

    // يجب التأكد من أن مكتبة JsBarcode متاحة في البيئة الخاصة بك
    // مثال: JsBarcode("#barcode", newCode, { ... });
    // سنستخدم فقط الـ console.log و الـ DOM manipulation هنا للافتراض
    
    // محاكاة استدعاء JsBarcode هنا
    // JsBarcode("#barcode", newCode, {
    //     format: "EAN13",
    //     displayValue: true, 
    //     margin: 10
    // });
    
    // هذه الأسطر تحتاج إلى وجود عنصري HTML بمعرف 'barcodeNumber' و 'barcode'
    // للعمل بشكل كامل في المتصفح.
    const barcodeNumberElement = document.getElementById('barcodeNumber');
    if (barcodeNumberElement) {
        barcodeNumberElement.innerText = "الرقم: " + newCode;
    }
    console.log("تم توليد باركود جديد: " + newCode);
}

/**
 * الدالة الجديدة: تحميل الباركود مباشرة كملف SVG. (تبقى كما هي)
 */
function downloadBarcode() {
    if (!currentBarcodeNumber) {
        alert('الرجاء توليد باركود أولاً!');
        return;
    }

    const svgElement = document.getElementById('barcode');
    // الحصول على رمز الـ SVG كنص
    const svgString = new XMLSerializer().serializeToString(svgElement);
    
    // إنشاء كائن Blob من نص الـ SVG
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    
    // إنشاء URL للكائن Blob
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // إنشاء رابط تحميل مؤقت
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `barcode_${currentBarcodeNumber}.svg`; // اسم الملف يتضمن رقم الباركود وصيغة SVG
    
    // تشغيل عملية التحميل
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // تحرير الـ URL الخاص بالـ Blob بعد التحميل
    URL.revokeObjectURL(svgUrl);
}

// توليد أول باركود عند تحميل الصفحة
// يجب إزالة هذه الأسطر إذا لم يتم تشغيلها في بيئة متصفح كاملة.
// window.onload = generateNewBarcode;
