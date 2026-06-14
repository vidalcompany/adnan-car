import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Bot, 
  Globe, 
  Layers, 
  ArrowLeftRight, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  DollarSign, 
  FileText, 
  Eye, 
  Upload, 
  Trash2, 
  RefreshCw, 
  ChevronRight, 
  Info,
  Sliders,
  Check,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

// مقداردهی اولیه متغیرهای محیطی گراوند شده
const appId = typeof __app_id !== 'undefined' ? __app_id : 'import-car-optimizer';

// تعریف خودروهای نمونه استخراج شده از بازارهای عربی (امارات و عربستان) برای شبیه‌سازی اولیه دیتابیس
const INITIAL_SCRAPED_CARS = [
  {
    id: "car-1",
    title_ar: "تويوتا كامري هايبرد 2023 فل كامل GLE",
    source: "Dubizzle UAE",
    brand: "Toyota",
    model: "Camry Hybrid",
    year: 2023,
    engine_cc: 2487,
    mileage_km: 35000,
    price_original: 88000, // به درهم امارات
    currency: "AED",
    price_usd: 23960,
    origin_country: "Japan",
    color: "سفید صدفی",
    specs_ar: "فتحة سقف، شاشة لمس، نظام الرادار وتحديد المسار، حساسات خلفية وأمامية، كراسي جلد كهربائية، بصمة تشغيل.",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "car-2",
    title_ar: "هيونداي إلنترا 2.0 لتر موديل 2021",
    source: "Syarah KSA",
    brand: "Hyundai",
    model: "Elantra",
    year: 2021,
    engine_cc: 2000,
    mileage_km: 72000,
    price_original: 54000, // به ریال عربستان
    currency: "SAR",
    price_usd: 14400,
    origin_country: "South Korea",
    color: "خاکستری متالیک",
    specs_ar: "مثبت سرعة، تحكم دركسون، كاميرا خلفية، ليد نهاري، جنوط مكحلة، نظام توفير الوقود ECO.",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "car-3",
    title_ar: "شيفروليه تاهو LT 2022 دبل",
    source: "Dubizzle UAE",
    brand: "Chevrolet",
    model: "Tahoe",
    year: 2022,
    engine_cc: 5300, // حجم موتور بالا (ممنوع گمرک)
    mileage_km: 48000,
    price_original: 175000, // به درهم امارات
    currency: "AED",
    price_usd: 47680, // قیمت بالای سقف واردات
    origin_country: "USA", // کشور ممنوعه از نظر گمرکی مستقیم
    color: "مشکی",
    specs_ar: "محرك 8 سلندر، دفع رباعي، شاشات خلفية، دخول ذكي، نظام تشغيل عن بعد، رادارات تصادم.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "car-4",
    title_ar: "مرسيدس بنز C200 موديل 2022 وارد قرقاش",
    source: "Dubizzle UAE",
    brand: "Mercedes-Benz",
    model: "C200",
    year: 2022,
    engine_cc: 1496, // حجم موتور مناسب (توربو)
    mileage_km: 29000,
    price_original: 185000, // به درهم امارات
    currency: "AED",
    price_usd: 50380, // بالای سقف قیمتی پیش‌فرض
    origin_country: "Germany",
    color: "سرمه‌ای متالیک",
    specs_ar: "بانوراما، شاشة عريضة ديجيتال، إضاءة داخلية 64 لون، نظام الملاحة متطور، كيت AMG أصلي.",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "car-5",
    title_ar: "كيا سبورتج 2019 دفع ثنائي 1.6 لتر",
    source: "OpenSooq Kuwait",
    brand: "Kia",
    model: "Sportage",
    year: 2019, // قدیمی‌تر از سقف ۵ سال کارکرده (در سال ۲۰۲۶)
    engine_cc: 1600,
    mileage_km: 110000,
    price_original: 3800, // به دینار کویت
    currency: "KWD",
    price_usd: 12350,
    origin_country: "South Korea",
    color: "نقره‌ای",
    specs_ar: "كشافات، تحكم مقود، سنسور خلفي، بلوتوث، ريموت كنترول، تكييف خلفي ممتاز.",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "car-6",
    title_ar: "تسلا موديل Y لونج رينج 2023",
    source: "Dubizzle UAE",
    brand: "Tesla",
    model: "Model Y",
    year: 2023,
    engine_cc: 0, // برقی (مجاز با تعرفه بسیار پایین)
    mileage_km: 18000,
    price_original: 149000, // به درهم امارات
    currency: "AED",
    price_usd: 40570,
    origin_country: "USA",
    color: "خاکستری",
    specs_ar: "نظام القيادة الذاتية الكامل Autopilot، سقف زجاجي كامل، بطارية مدى طويل، تسارع ممتاز.",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800"
  }
];

export default function App() {
  // تبرهای سیستم (Tabs)
  const [activeTab, setActiveTab] = useState('overview');

  // استیت‌های قوانین واردات خودرو در ایران (قابل ویرایش توسط کاربر)
  const [rules, setRules] = useState({
    maxCarAgeYears: 5,        // حداکثر سن خودرو بر اساس سال ساخت
    maxEngineCC: 2500,        // حداکثر حجم موتور به سی‌سی
    maxPriceUSD: 40000,       // سقف ارزش دلاری گمرک خودرو
    allowElectric: true,      // اجازه ورود خودروهای برقی بدون محدودیت حجم موتور
    forbiddenBrands: ['Chevrolet', 'Ford', 'GMC', 'Dodge'], // برندهای فدرال ممنوعه مستقیم
    customsDutyPercent: 75,   // درصد عوارض و تعرفه واردات متوسط بنزینی
    hybridDutyPercent: 15,    // درصد عوارض و تعرفه خودروهای هیبرید
    electricDutyPercent: 5,   // درصد عوارض و تعرفه خودروهای برقی
  });

  // نرخ تبدیل ارزها به ریال ایران (محاسبه نهایی به تومان)
  const [exchangeRates, setExchangeRates] = useState({
    USD_TO_TOMAN: 65000,  // نرخ تتر/دلار تقریبی در بازار ایران
    AED_TO_TOMAN: 17800,  // نرخ درهم به تومان
    SAR_TO_TOMAN: 17300,  // ریال عربستان به تومان
    KWD_TO_TOMAN: 211000, // دینار کویت به تومان
  });

  // هزینه‌های ثابت واردات (حمل و نقل، پلاک ملی، ترخیص، کارت بازرگانی) به دلار
  const [importFixedCostsUSD, setImportFixedCostsUSD] = useState({
    shippingAndLogistics: 2200, // هزینه حمل و نقل دریایی تا بنادر ایران
    clearanceAndBrokerage: 1200, // هزینه ترخیص و واسطه‌گری گمرکی
    nationalPlateAndTaxes: 1500, // هزینه عوارض شهرداری، اسقاط خودرو کهنه و پلاک ملی
    ourCommissionPercent: 8,     // سود بازرگانی شرکت شما (به درصد کل قیمت پایه)
  });

  // لیست خودروهای در دسترس در فرآیند سیستم
  const [scrapedCars, setScrapedCars] = useState(INITIAL_SCRAPED_CARS);
  const [logMessages, setLogMessages] = useState([]);
  const [isScraping, setIsScraping] = useState(false);
  const [activeProcessingCar, setActiveProcessingCar] = useState(null);

  // دیتابیس بومی‌سازی شده‌ها و آماده انتشار در سایت
  const [publishedCatalog, setPublishedCatalog] = useState([
    {
      id: "pub-1",
      title_fa: "تویوتا کمری هیبرید مدل ۲۰۲۳ فول کامل GLE",
      originalId: "car-1",
      brand: "Toyota",
      model: "Camry Hybrid",
      year: 2023,
      engine_cc: 2487,
      mileage_km: 35000,
      price_original_desc: "88,000 درهم امارات",
      price_toman_final: 2415000000, // قیمت تخمینی به تومان
      price_usd_breakdown: {
        basePriceUSD: 23960,
        shippingUSD: 2200,
        customsUSD: 3594, // با تعرفه هیبرید ۱۵ درصد
        brokerageUSD: 1200,
        plateUSD: 1500,
        commissionUSD: 1916,
        totalUSD: 34370
      },
      specs_fa: "سانروف برقی، مانیتور لمسی بزرگ، سنسورهای پارک جلو و عقب، سیستم رادار نقطه کور و رادار بین خطوط، صندلی‌های چرمی برقی، استارت دکمه‌ای هوشمند، در وضعیت استثنایی بدون خط و خش.",
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800",
      status: "موجود جهت ثبت سفارش"
    }
  ]);

  // استیت‌های مربوط به هوش مصنوعی (Gemini API)
  const [customApiKey, setCustomApiKey] = useState('');
  const [aiStatus, setAiStatus] = useState('ready'); // ready, loading, error

  // ارزیابی انطباق خودرو با قوانین ایران
  const validateCarForImport = (car) => {
    const currentYear = 2026;
    const errors = [];

    // قانون ۱: بررسی برقی بودن و حذف فیلتر موتور
    const isElectric = car.engine_cc === 0;
    
    // قانون ۲: سال ساخت خودرو
    const carAge = currentYear - car.year;
    if (carAge > rules.maxCarAgeYears) {
      errors.push(`سن خودرو (${carAge} سال) بیش از سقف مجاز مجمع گمرکی (${rules.maxCarAgeYears} سال) است.`);
    }

    // قانون ۳: حجم موتور (برای غیربرقی‌ها)
    if (!isElectric && car.engine_cc > rules.maxEngineCC) {
      errors.push(`حجم موتور (${car.engine_cc} سی‌سی) بیشتر از حد مجاز (${rules.maxEngineCC} سی‌سی) است.`);
    }

    // قانون ۴: سقف قیمتی خودرو
    if (car.price_usd > rules.maxPriceUSD) {
      errors.push(`ارزش دلاری خودرو ($${car.price_usd.toLocaleString()}) بالاتر از سقف گمرکی مصوب ($${rules.maxPriceUSD.toLocaleString()}) است.`);
    }

    // قانون ۵: برندهای ممنوعه ملی
    if (rules.forbiddenBrands.includes(car.brand)) {
      errors.push(`برند خودرو (${car.brand}) به علت عدم انطباق با ضوابط واردات ملی در لیست سیاه گمرک قرار دارد.`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  };

  // شبیه‌سازی ورود زنده اطلاعات جدید از سایت‌های عربی با زدن دکمه اسکرپ
  const startScrapingSimulation = () => {
    setIsScraping(true);
    setLogMessages([]);
    let counter = 0;
    
    const logs = [
      "🔄 اتصال به سرورهای توزیع دیتای خلیج فارس برقرار شد...",
      "📡 بررسی آگهی‌های سایت Dubizzle امارات و Syarah عربستان...",
      "🔍 فیلترگذاری اولیه: مدل‌های 2020 به بعد با ثبت کارکرد مجاز...",
      "📥 دریافت مشخصات فنی و تصاویر زنده خودروها...",
    ];

    const interval = setInterval(() => {
      if (counter < logs.length) {
        setLogMessages(prev => [...prev, logs[counter]]);
        counter++;
      } else {
        clearInterval(interval);
        setIsScraping(false);
        setLogMessages(prev => [...prev, "✅ فرآیند استخراج با موفقیت پایان یافت. ۶ خودرو بارگذاری و بر اساس قوانین فیلتر شدند."]);
      }
    }, 1200);
  };

  // محاسبه خودکار هزینه‌های واردات بر اساس فرمول‌های گمرکی تعیین شده
  const calculateImportPricing = (car) => {
    const basePriceUSD = car.price_usd;
    
    // تعیین عوارض گمرکی بر اساس نوع موتور خودرو
    let dutyPercent = rules.customsDutyPercent;
    if (car.engine_cc === 0) {
      dutyPercent = rules.electricDutyPercent; // خودرو برقی
    } else if (car.model.toLowerCase().includes('hybrid') || car.title_ar.includes('هايبرد')) {
      dutyPercent = rules.hybridDutyPercent; // خودرو هیبریدی
    }

    const customsUSD = (basePriceUSD * dutyPercent) / 100;
    const shippingUSD = importFixedCostsUSD.shippingAndLogistics;
    const brokerageUSD = importFixedCostsUSD.clearanceAndBrokerage;
    const plateUSD = importFixedCostsUSD.nationalPlateAndTaxes;
    
    // سود شرکت واردکننده شما
    const commissionUSD = (basePriceUSD * importFixedCostsUSD.ourCommissionPercent) / 100;

    const totalUSD = basePriceUSD + customsUSD + shippingUSD + brokerageUSD + plateUSD + commissionUSD;
    const totalToman = totalUSD * exchangeRates.USD_TO_TOMAN;

    return {
      basePriceUSD,
      customsUSD,
      shippingUSD,
      brokerageUSD,
      plateUSD,
      commissionUSD,
      totalUSD,
      totalToman
    };
  };

  // فراخوانی واقعی یا شبه‌واقعی API هوش مصنوعی برای ترجمه و بومی‌سازی مشخصات فنی خودرو به فارسی روان
  const handleAILocalization = async (car) => {
    setActiveProcessingCar(car);
    setAiStatus('loading');

    const pricing = calculateImportPricing(car);
    
    // آماده‌سازی متن پرامپت برای ارسال به جمینای
    const promptText = `
    وظیفه شما بومی‌سازی و ترجمه یک مشخصات خودروی کارکرده عربی برای درج در یک پورتال ایرانی واردات خودرو است.
    مشخصات اصلی خودرو:
    نام به عربی: ${car.title_ar}
    برند: ${car.brand}
    مدل: ${car.model}
    سال ساخت: ${car.year}
    رنگ: ${car.color}
    امکانات ثبت شده عربی: ${car.specs_ar}

    لطفا این اطلاعات را به یک قالب شیک و جذاب فارسی ترجمه کنید. خروجی باید شامل دو فیلد با فرمت JSON دقیق باشد:
    1. "title_fa": عنوان جذاب فارسی مناسب بازار ایران (مثال: تویوتا کمری هیبرید مدل ۲۰۲۳ فول آپشن)
    2. "specs_fa": یک یا دو پاراگراف توصیفی از آپشن‌ها و امکانات خودرو به فارسی روان به همراه معادل‌سازی اصطلاحات خودرویی (مثلاً "فتحة سقف" به "سانروف"، "جنوط" به "رینگ‌های اسپرت" و غیره).

    فقط و فقط یک فرمت JSON برگردانید بدون اضافه کردن مارک‌داون یا توضیحات دیگر. نمونه خروجی:
    {
      "title_fa": "عنوان فارسی",
      "specs_fa": "توضیحات روان فارسی"
    }
    `;

    // تلاش برای فراخوانی API رسمی جمینای با مکانیزم ریترا و مدیریت خطا
    const apiKeyToUse = customApiKey || ""; // استفاده از کلید محیطی در صورت عدم وارد کردن کلید دستی توسط کاربر
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKeyToUse}`;

    let responseText = "";
    let success = false;

    if (apiKeyToUse) {
      // در صورتی که کلید API معتبر وجود داشته باشد فرآیند واقعی آغاز می‌شود
      let retries = 3;
      let delay = 1000;
      
      while (retries > 0 && !success) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }]
            })
          });

          if (response.ok) {
            const data = await response.json();
            responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            success = true;
          } else {
            throw new Error(`خطای سرور گوگل: ${response.status}`);
          }
        } catch (error) {
          retries--;
          if (retries === 0) {
            console.error("تمام دفعات تکرار برای ارتباط با جمینای شکست خورد:", error);
          } else {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // بک‌آف نمایی
          }
        }
      }
    }

    // شبیه‌ساز آفلاین هوشمند در صورت ناموفق بودن درخواست API یا عدم تنظیم کلید
    if (!success) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // شبیه‌سازی پاسخ بومی‌سازی شده
      let mockTitle = `${car.brand === 'Toyota' ? 'تویوتا' : car.brand === 'Hyundai' ? 'هیوندای' : car.brand === 'Kia' ? 'کیا' : car.brand === 'Mercedes-Benz' ? 'مرسدس بنز' : 'تسلا'} ${car.model === 'Camry Hybrid' ? 'کمری هیبرید' : car.model === 'Elantra' ? 'النترا' : car.model === 'Sportage' ? 'اسپورتیج' : car.model === 'C200' ? 'کلاس C200' : 'مدل Y برقی'} مدل ${car.year === 2023 ? '۲۰۲۳' : car.year === 2022 ? '۲۰۲۲' : car.year === 2021 ? '۲۰۲۱' : '۲۰۱۹'}`;
      let mockSpecs = `نسخه سفارش خلیج فارس دارای تریم داخلی بسیار شیک و باکیفیت، مانیتور لمسی چندرسانه‌ای پیشرفته، سنسورهای هوشمند کمکی جلو و عقب، سیستم پایداری و کنترل کشش خودرو، آینه‌های تاشو برقی به همراه راهنما و رینگ‌های اسپرت جذاب و مستحکم. خودرو به طور کامل از نظر فنی و بدنه بازرسی شده و مناسب‌ترین پیشنهاد خرید جهت مصرف‌کننده ایرانی می‌باشد.`;
      
      if (car.engine_cc === 0) {
        mockSpecs += " این خودروی تمام‌برقی (EV) با ظرفیت باتری قوی و برد مسافتی عالی دارای شتاب فوق‌العاده و هزینه‌های گمرکی بسیار ناچیز جهت پلاک‌گذاری در کشور می‌باشد.";
      }

      responseText = JSON.stringify({
        title_fa: mockTitle,
        specs_fa: mockSpecs
      });
    }

    try {
      // پاکسازی خروجی JSON از هر نوع متادیتا یا متن‌های تصادفی احتمالی
      const cleanJsonStr = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsedData = JSON.parse(cleanJsonStr);

      const localizedCar = {
        id: `pub-${Date.now()}`,
        title_fa: parsedData.title_fa,
        originalId: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        engine_cc: car.engine_cc,
        mileage_km: car.mileage_km,
        price_original_desc: `${car.price_original.toLocaleString()} ${car.currency}`,
        price_toman_final: Math.round(pricing.totalToman),
        price_usd_breakdown: {
          basePriceUSD: pricing.basePriceUSD,
          customsUSD: Math.round(pricing.customsUSD),
          shippingUSD: pricing.shippingUSD,
          brokerageUSD: pricing.brokerageUSD,
          plateUSD: pricing.plateUSD,
          commissionUSD: Math.round(pricing.commissionUSD),
          totalUSD: Math.round(pricing.totalUSD)
        },
        specs_fa: parsedData.specs_fa,
        image: car.image,
        status: "موجود جهت ثبت سفارش"
      };

      // افزودن خودروی جدید به کاتالوگ نهایی منتشر شده در وب‌سایت
      setPublishedCatalog(prev => [localizedCar, ...prev]);
      setAiStatus('success');
      
      // هدایت اتوماتیک کاربر به پورتال نمایش جهت دیدن محصول آپلود شده جدید
      setTimeout(() => {
        setActiveTab('portal');
        setActiveProcessingCar(null);
        setAiStatus('ready');
      }, 1500);

    } catch (e) {
      console.error("خطا در پارس کردن نتیجه JSON هوش مصنوعی:", e);
      setAiStatus('error');
    }
  };

  // حذف محصول از کاتالوگ عمومی
  const deleteFromCatalog = (id) => {
    setPublishedCatalog(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* هدر بالایی برنامه */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-yellow-400 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
              <Bot className="w-8 h-8 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">سامانه هوشمند مانیتورینگ و واردات خودرو</h1>
              <p className="text-xs text-slate-400 mt-1">پایش سایت‌های عربی، مطابقت با قوانین گمرک ایران و بازنویسی با هوش مصنوعی جمینای</p>
            </div>
          </div>
          
          {/* تب‌های اصلی بالای صفحه */}
          <nav className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1 overflow-x-auto w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <TrendingUp className="w-4 h-4" />
              پیشخوان
            </button>
            <button 
              onClick={() => setActiveTab('scraper')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'scraper' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Bot className="w-4 h-4" />
              ربات کاوشگر
            </button>
            <button 
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'rules' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Settings className="w-4 h-4" />
              قوانین واردات
            </button>
            <button 
              onClick={() => setActiveTab('portal')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'portal' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Globe className="w-4 h-4" />
              پورتال عمومی پیشنهادات
            </button>
          </nav>
        </div>
      </header>

      {/* محتوای اصلی صفحات */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* بخش تنظیم سریع نرخ ارز جهت اطلاع ممتد */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="text-sm font-semibold text-slate-300">قیمت زنده ارزهای مبدأ (تومان):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-400 block">حواله دلار</span>
              <input 
                type="number" 
                value={exchangeRates.USD_TO_TOMAN} 
                onChange={(e) => setExchangeRates({...exchangeRates, USD_TO_TOMAN: parseInt(e.target.value) || 0})}
                className="bg-transparent text-sm text-center font-bold text-amber-400 w-24 outline-none focus:border-amber-500 mt-0.5"
              />
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-400 block">درهم امارات (AED)</span>
              <input 
                type="number" 
                value={exchangeRates.AED_TO_TOMAN} 
                onChange={(e) => setExchangeRates({...exchangeRates, AED_TO_TOMAN: parseInt(e.target.value) || 0})}
                className="bg-transparent text-sm text-center font-bold text-slate-200 w-24 outline-none focus:border-amber-500 mt-0.5"
              />
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-400 block">ریال عربستان (SAR)</span>
              <input 
                type="number" 
                value={exchangeRates.SAR_TO_TOMAN} 
                onChange={(e) => setExchangeRates({...exchangeRates, SAR_TO_TOMAN: parseInt(e.target.value) || 0})}
                className="bg-transparent text-sm text-center font-bold text-slate-200 w-24 outline-none focus:border-amber-500 mt-0.5"
              />
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
              <span className="text-xs text-slate-400 block">دینار کویت (KWD)</span>
              <input 
                type="number" 
                value={exchangeRates.KWD_TO_TOMAN} 
                onChange={(e) => setExchangeRates({...exchangeRates, KWD_TO_TOMAN: parseInt(e.target.value) || 0})}
                className="bg-transparent text-sm text-center font-bold text-slate-200 w-24 outline-none focus:border-amber-500 mt-0.5"
              />
            </div>
          </div>
        </div>

        {/* ۱. صفحه پیشخوان و آمار */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* کارت‌های آماری */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold block">کل خودروهای رصد شده</span>
                  <span className="text-3xl font-extrabold text-white mt-1 block">{scrapedCars.length}</span>
                  <span className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    به‌روزرسانی خودکار زنده
                  </span>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl text-amber-500">
                  <Bot className="w-8 h-8" />
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold block">تایید شده جهت واردات</span>
                  <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">
                    {scrapedCars.filter(c => validateCarForImport(c).isValid).length}
                  </span>
                  <span className="text-[11px] text-emerald-400 mt-1 block">منطبق با آیین‌نامه گمرکی</span>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl text-emerald-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold block">پیشنهادهای منتشر شده</span>
                  <span className="text-3xl font-extrabold text-blue-400 mt-1 block">{publishedCatalog.length}</span>
                  <span className="text-[11px] text-blue-400 mt-1 block">آماده نمایش و خرید سرمایه‌گذار</span>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl text-blue-500">
                  <Globe className="w-8 h-8" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold block">میانگین بازدهی واردات</span>
                  <span className="text-3xl font-extrabold text-amber-500 mt-1 block">٪{importFixedCostsUSD.ourCommissionPercent}</span>
                  <span className="text-[11px] text-amber-400 mt-1 block">سود ناخالص بازرگانی تعیین شده</span>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl text-amber-500">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* گام‌های کارکرد سیستم برای راهنمایی کاربر */}
            <div className="bg-gradient-to-l from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                چرخه کارکرد ۱۰۰٪ هوشمند سیستم وارداتی شما
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 relative">
                  <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full">گام ۱</span>
                  <h4 className="font-bold text-sm text-slate-200 mt-2 mb-1.5">استخراج خودکار (Scraping)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">ربات وارد بازارهای امارات، عربستان یا کویت شده و با دور زدن سیستم‌های ضدربات، مشخصات و عکس‌های باکیفیت خودروها را ذخیره می‌کند.</p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 relative">
                  <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full">گام ۲</span>
                  <h4 className="font-bold text-sm text-slate-200 mt-2 mb-1.5">فیلتر مقررات گمرکی ایران</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">خودروها بر اساس حجم موتور، سال تولید و برند با آیین‌نامه گمرکی ایران سنجیده شده و موارد فاقد شرایط در ثانیه اول رد می‌شوند.</p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 relative">
                  <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full">گام ۳</span>
                  <h4 className="font-bold text-sm text-slate-200 mt-2 mb-1.5">بومی‌سازی و ترجمه با AI</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">با استفاده از هوش مصنوعی جمینای، عنوان و آپشن‌های عربی به صورت فوق روان به اصطلاحات بازار ایران تبدیل و هزینه‌های گمرکی محاسبه می‌شوند.</p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 relative">
                  <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full">گام ۴</span>
                  <h4 className="font-bold text-sm text-slate-200 mt-2 mb-1.5">انتشار نهایی در سایت</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">آگهی‌های آماده با قیمت تخمینی به تومان، روی وب‌سایت عمومی برای خرید یا مشارکت در واردات سرمایه‌گذاران منتشر می‌شوند.</p>
                </div>

              </div>
            </div>

            {/* بخش کلید API جمینای */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-bold text-md text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    تنظیم کلید اختصاصی هوش مصنوعی (اختیاری)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">به طور پیش‌فرض سیستم دارای شبیه‌ساز آفلاین است، اما در صورت وارد کردن کلید Gemini API اختصاصی خود، عملیات بازنویسی و بومی‌سازی مشخصات با هوش مصنوعی واقعی گوگل انجام خواهد شد.</p>
                </div>
                <div className="w-full md:w-auto flex gap-2">
                  <input 
                    type="password"
                    placeholder="AI API Key خود را وارد کنید..."
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-amber-500 w-full md:w-72"
                  />
                  {customApiKey ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> فعال
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ۲. صفحه ربات کاوشگر و لیست خودروهای استخراج شده */}
        {activeTab === 'scraper' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bot className="w-6 h-6 text-amber-500" />
                    ربات پایش زنده بازار خودروهای دست دوم عربی
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">با کلیک بر روی دکمه شروع، سیستم سناریوی وب‌اسکرپینگ را بر روی سایت‌های اماراتی و عربستانی شبیه‌سازی می‌کند.</p>
                </div>
                <button
                  onClick={startScrapingSimulation}
                  disabled={isScraping}
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 disabled:opacity-50 w-full md:w-auto justify-center"
                >
                  <RefreshCw className={`w-5 h-5 ${isScraping ? 'animate-spin' : ''}`} />
                  {isScraping ? 'در حال رصد آگهی‌ها...' : 'شروع اسکرپ و رصد زنده بازار'}
                </button>
              </div>

              {/* ترمینال و گزارشات ربات */}
              {logMessages.length > 0 && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto mb-6">
                  {logMessages.map((msg, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-amber-500">›</span>
                      <p>{msg}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* جدول خودروهای استخراج شده همراه با فیلتر گمرک */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-right border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold">
                      <th className="p-4">مشخصات اولیه خودروی مبدأ</th>
                      <th className="p-4">منبع و قیمت اصلی</th>
                      <th className="p-4">حجم موتور / سال</th>
                      <th className="p-4">تطبیق با قوانین ایران</th>
                      <th className="p-4 text-left">عملیات بازنویسی و انتشار</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {scrapedCars.map((car) => {
                      const validation = validateCarForImport(car);
                      return (
                        <tr key={car.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={car.image} alt={car.title_ar} className="w-16 h-12 rounded-lg object-cover border border-slate-800" />
                              <div>
                                <span className="font-semibold text-slate-200 block text-xs mb-1">{car.title_ar}</span>
                                <div className="flex gap-2 text-[10px]">
                                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{car.brand}</span>
                                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{car.color}</span>
                                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">ساخت {car.origin_country}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-400 text-xs block">{car.source}</span>
                            <span className="font-bold text-white block mt-0.5">{car.price_original.toLocaleString()} {car.currency}</span>
                            <span className="text-[10px] text-slate-400 block">${car.price_usd.toLocaleString()} USD</span>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-200 block font-mono text-xs">{car.engine_cc === 0 ? 'برقی' : `${car.engine_cc} سی‌سی`}</span>
                            <span className="text-slate-400 text-xs mt-0.5 block">سال تولید: {car.year}</span>
                          </td>
                          <td className="p-4">
                            {validation.isValid ? (
                              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs w-fit">
                                <CheckCircle2 className="w-4 h-4" />
                                مورد تایید واردات
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg text-xs w-fit">
                                  <XCircle className="w-4 h-4" />
                                  غیرمجاز
                                </div>
                                <div className="text-[10px] text-rose-400 max-w-[200px] leading-relaxed">
                                  {validation.errors.map((err, i) => (
                                    <div key={i}>• {err}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-left">
                            {validation.isValid ? (
                              <button
                                onClick={() => handleAILocalization(car)}
                                disabled={activeProcessingCar?.id === car.id}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-purple-500/10 flex items-center gap-1.5 inline-flex"
                              >
                                {activeProcessingCar?.id === car.id && aiStatus === 'loading' ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    در حال ترجمه...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                                    ترجمه و بومی‌سازی AI
                                  </>
                                )}
                              </button>
                            ) : (
                              <button className="bg-slate-800 text-slate-500 text-xs font-bold px-3.5 py-2 rounded-xl cursor-not-allowed inline-flex" disabled>
                                عدم امکان واردات
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ۳. صفحه ویرایش قوانین واردات */}
        {activeTab === 'rules' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* فرم تغییر قوانین گمرک */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-amber-500" />
                  تنظیمات هسته منطقی گمرک جمهوری اسلامی ایران
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">حداکثر سن خودرو بر اساس سال ساخت (سال):</label>
                    <input 
                      type="number" 
                      value={rules.maxCarAgeYears}
                      onChange={(e) => setRules({...rules, maxCarAgeYears: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">حداکثر حجم موتور مجاز خودروی بنزینی (سی‌سی):</label>
                    <input 
                      type="number" 
                      value={rules.maxEngineCC}
                      onChange={(e) => setRules({...rules, maxEngineCC: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">سقف ارزش دلاری خرید خودرو مجاز ($):</label>
                    <input 
                      type="number" 
                      value={rules.maxPriceUSD}
                      onChange={(e) => setRules({...rules, maxPriceUSD: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">تعرفه واردات پیش‌فرض خودروی بنزینی (درصد):</label>
                    <input 
                      type="number" 
                      value={rules.customsDutyPercent}
                      onChange={(e) => setRules({...rules, customsDutyPercent: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">تعرفه عوارض خودروهای هیبریدی (درصد):</label>
                    <input 
                      type="number" 
                      value={rules.hybridDutyPercent}
                      onChange={(e) => setRules({...rules, hybridDutyPercent: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">تعرفه عوارض خودروهای تمام‌برقی (درصد):</label>
                    <input 
                      type="number" 
                      value={rules.electricDutyPercent}
                      onChange={(e) => setRules({...rules, electricDutyPercent: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h4 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    لیست سیاه برندهای غیرمجاز (واردات مستقیم ممنوع):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rules.forbiddenBrands.map((brand, i) => (
                      <span key={i} className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        {brand}
                        <Trash2 
                          className="w-3.5 h-3.5 cursor-pointer hover:text-rose-200" 
                          onClick={() => setRules({...rules, forbiddenBrands: rules.forbiddenBrands.filter(b => b !== brand)})}
                        />
                      </span>
                    ))}
                    <button 
                      onClick={() => {
                        const newBrand = prompt("نام برند ممنوعه جدید را به انگلیسی بنویسید (مثلاً Ford):");
                        if (newBrand) setRules({...rules, forbiddenBrands: [...rules.forbiddenBrands, newBrand.trim()]});
                      }}
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl border-dashed hover:border-amber-500 transition-colors"
                    >
                      + افزودن برند جدید
                    </button>
                  </div>
                </div>
              </div>

              {/* پنل هزینه‌های جانبی واردات */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                  برآورد هزینه‌های حمل، ترخیص و پورسانت
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">هزینه حمل و نقل دریایی کانتینر (دلار):</label>
                    <input 
                      type="number" 
                      value={importFixedCostsUSD.shippingAndLogistics}
                      onChange={(e) => setImportFixedCostsUSD({...importFixedCostsUSD, shippingAndLogistics: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">هزینه ترخیص و حق‌العمل کارگزاری (دلار):</label>
                    <input 
                      type="number" 
                      value={importFixedCostsUSD.clearanceAndBrokerage}
                      onChange={(e) => setImportFixedCostsUSD({...importFixedCostsUSD, clearanceAndBrokerage: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">هزینه‌های اسقاط، ترخیص بندر و پلاک ملی (دلار):</label>
                    <input 
                      type="number" 
                      value={importFixedCostsUSD.nationalPlateAndTaxes}
                      onChange={(e) => setImportFixedCostsUSD({...importFixedCostsUSD, nationalPlateAndTaxes: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-2">درصد سود خالص شرکت وارداتی شما (٪):</label>
                    <input 
                      type="number" 
                      value={importFixedCostsUSD.ourCommissionPercent}
                      onChange={(e) => setImportFixedCostsUSD({...importFixedCostsUSD, ourCommissionPercent: parseInt(e.target.value) || 0})}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white w-full outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ۴. پورتال عمومی نمایش پیشنهادات وارداتی در سایت شما */}
        {activeTab === 'portal' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-amber-500" />
                  نمای پورتال عمومی سایت جهت پیشنهادات وارداتی به مشتریان
                </h3>
                <p className="text-xs text-slate-400 mt-1">آگهی‌های تایید شده که به صورت فارسی روان بازنویسی شده و با احتساب تعرفه، عوارض گمرک و هزینه حمل، قیمت نهایی به تومان ارائه شده است.</p>
              </div>
            </div>

            {publishedCatalog.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h4 className="font-bold text-md text-white mb-1">کاتالوگ شما خالی است</h4>
                <p className="text-xs text-slate-400 mb-6">ابتدا به بخش «ربات کاوشگر» رفته و یکی از خودروهای منطبق بر قوانین گمرک را ترجمه و منتشر نمایید.</p>
                <button 
                  onClick={() => setActiveTab('scraper')}
                  className="bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  انتقال به بخش اسکرپر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {publishedCatalog.map((car) => (
                  <div key={car.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xl">
                    <div className="md:w-1/2 relative h-56 md:h-auto">
                      <img src={car.image} alt={car.title_fa} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md">
                        {car.status}
                      </span>
                    </div>
                    <div className="p-6 md:w-1/2 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-md text-white line-clamp-2 leading-snug mb-2">{car.title_fa}</h4>
                        
                        <div className="grid grid-cols-2 gap-2 my-3 text-[11px] text-slate-400">
                          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800/60">
                            <span className="block text-slate-500">سال ساخت:</span>
                            <strong className="text-slate-200">{car.year}</strong>
                          </div>
                          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800/60">
                            <span className="block text-slate-500">کارکرد (کیلومتر):</span>
                            <strong className="text-slate-200">{car.mileage_km.toLocaleString()}</strong>
                          </div>
                          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800/60">
                            <span className="block text-slate-500">حجم موتور:</span>
                            <strong className="text-slate-200">{car.engine_cc === 0 ? 'تمام برقی' : `${car.engine_cc} CC`}</strong>
                          </div>
                          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800/60">
                            <span className="block text-slate-500">قیمت مبدأ:</span>
                            <strong className="text-slate-200">{car.price_original_desc}</strong>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 mt-2">
                          {car.specs_fa}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-slate-800 pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-slate-400">قیمت تخمینی ترخیص‌شده در ایران:</span>
                          <span className="text-lg font-black text-amber-400">
                            {(car.price_toman_final / 1000000000).toFixed(3)} میلیارد تومان
                          </span>
                        </div>
                        
                        {/* بخش کشویی نمایش جزئیات دقیق ترخیص و گمرک */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 mb-4 text-[10px] text-slate-400 space-y-1.5">
                          <div className="flex justify-between">
                            <span>قیمت خرید در مبدأ خلیج فارس:</span>
                            <strong className="text-slate-300">${car.price_usd_breakdown.basePriceUSD.toLocaleString()} USD</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>تعرفه گمرکی و عوارض واردات:</span>
                            <strong className="text-slate-300">${car.price_usd_breakdown.customsUSD.toLocaleString()} USD</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>حمل تا بنادر ایران + واسطه‌گری ترخیص:</span>
                            <strong className="text-slate-300">${(car.price_usd_breakdown.shippingUSD + car.price_usd_breakdown.brokerageUSD).toLocaleString()} USD</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>هزینه پلاک ملی و مالیات شهرداری:</span>
                            <strong className="text-slate-300">${car.price_usd_breakdown.plateUSD.toLocaleString()} USD</strong>
                          </div>
                          <div className="flex justify-between text-amber-400/80">
                            <span>سود کارمزد شرکت وارداتی شما:</span>
                            <strong>${car.price_usd_breakdown.commissionUSD.toLocaleString()} USD</strong>
                          </div>
                          <div className="border-t border-slate-800/80 pt-1.5 flex justify-between font-bold text-slate-200">
                            <span>جمع کل ارزش ارزی خودرو:</span>
                            <span>${car.price_usd_breakdown.totalUSD.toLocaleString()} USD</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              alert(`درخواست سفارش واردات خودروی ${car.title_fa} ثبت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.`);
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs w-full transition-all flex items-center justify-center gap-1"
                          >
                            درخواست خرید و واردات سفارشی
                          </button>
                          <button 
                            onClick={() => deleteFromCatalog(car.id)}
                            className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 p-2 rounded-xl transition-all"
                            title="حذف از پورتال پیشنهادی"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* بخش پاورقی برنامه */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 mt-16 text-center text-xs text-slate-500">
        <p>© ۱۴۰۵ سامانه هوشمند مدیریت واردات خودروهای کارکرده. تمامی حقوق برای پلتفرم بازرگانی شما محفوظ است.</p>
        <p className="mt-1">توسعه‌یافته بر بستر فریمورک پیشرفته فرانت‌اند با قابلیت یکپارچه‌سازی وب‌سایت‌های عربی در ورسل.</p>
      </footer>

    </div>
  );
}
