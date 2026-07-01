/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined or is a placeholder. AI features will fallback to smart template responses.");
}

// 1. Generate Description Endpoint
app.post("/api/gemini/generate-description", async (req, res) => {
  const { type, transactionType, area, rooms, neighborhood, city, features, customNotes } = req.body;

  if (!ai) {
    // Elegant fallback if no API key is active
    const featuresList = Object.entries(features || {})
      .filter(([_, val]) => val)
      .map(([key]) => key === 'parking' ? 'پارکینگ' : key === 'elevator' ? 'آسانسور' : key === 'warehouse' ? 'انباری' : key === 'balcony' ? 'بالکن' : key === 'pool' ? 'استخر' : key === 'sauna' ? 'سونا' : 'جکوزی')
      .join('، ');

    const rentOrBuy = transactionType === 'buy' ? 'فروش' : 'اجاره';
    const fallbackDesc = `آپارتمان بی‌نظیر برای ${rentOrBuy} واقع در محله دنج و اعیان‌نشین ${neighborhood} در شهر ${city}. این واحد با متراژ ${area} متر مربع دارای ${rooms} اتاق خواب بزرگ با نورگیری عالی می‌باشد. از امکانات ویژه این ملک می‌توان به ${featuresList || 'امکانات استاندارد'} اشاره کرد. لوکیشن فوق‌العاده با دسترسی عالی به اتوبان‌ها و مراکز خرید. مناسب سخت‌پسندان و سرمایه‌گذاری مطمئن. ${customNotes || ''}`;
    return res.json({ text: fallbackDesc, fallback: true });
  }

  try {
    const featureLabels = Object.entries(features || {})
      .filter(([_, val]) => val)
      .map(([key]) => key)
      .join(', ');

    const prompt = `یک توضیحات آگهی املاک بسیار جذاب، مجلل، ترغیب‌کننده و کاملاً حرفه‌ای به زبان فارسی برای یک ${type} در وضعیت ${transactionType === 'buy' ? 'فروش' : 'اجاره'} بنویس.
مشخصات ملک:
- متراژ: ${area} متر
- تعداد خواب: ${rooms}
- شهر: ${city}
- محله: ${neighborhood}
- امکانات فعال: ${featureLabels}
- نکات اضافی و دلخواه کاربر: ${customNotes || 'ندارد'}

لحن متن شیوا، لوکس و مناسب دپارتمان‌های بزرگ املاک تهران باشد. از کلماتی مانند «بی‌نظیر»، «غرق در نور»، «خوش‌نقشه» استفاده کن و فضا را به خوبی توصیف کن.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "شما یک مشاور املاک ارشد، با سابقه و لوکس در تهران هستید که نویسنده توصیفات برتر آگهی‌های املاک در ایران است."
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Generate Description error:", error);
    res.status(500).json({ error: error.message || "خطا در برقراری ارتباط با هوش مصنوعی" });
  }
});

// 2. Estimate Price Endpoint
app.post("/api/gemini/estimate-price", async (req, res) => {
  const { type, transactionType, area, rooms, yearBuilt, neighborhood, city, features } = req.body;

  if (!ai) {
    // Smart fallback simulation
    const basePricePerMeter = neighborhood === 'نیاوران' || neighborhood === 'فرشته' || neighborhood === 'زعفرانیه' ? 200000000 : 120000000;
    const estimatedValue = area * basePricePerMeter * (1 - (1405 - yearBuilt) * 0.015);
    const formattedPrice = estimatedValue.toLocaleString('fa-IR');
    
    let analysis = `بر اساس داده‌های آماری محله ${neighborhood} در شهر ${city}، قیمت پایه به دلیل متراژ ${area} متری و امکاناتی نظیر آسانسور و پارکینگ برآورد شد. به علت سال ساخت ${yearBuilt}، ضریب استهلاک جزیی اعمال شده است.`;
    return res.json({
      estimatedPrice: `${formattedPrice} تومان`,
      estimatedRange: `${(estimatedValue * 0.95).toLocaleString('fa-IR')} تا ${(estimatedValue * 1.05).toLocaleString('fa-IR')} تومان`,
      analysis,
      fallback: true
    });
  }

  try {
    const featureLabels = Object.entries(features || {})
      .filter(([_, val]) => val)
      .map(([key]) => key)
      .join(', ');

    const prompt = `تحلیل قیمت و تخمین حدودی ارزش روز ملک به تومان (Tomans) در ایران با مشخصات زیر:
- نوع ملک: ${type}
- نوع معامله: ${transactionType === 'buy' ? 'فروش' : 'اجاره'}
- متراژ: ${area} متر
- تعداد خواب: ${rooms}
- سال ساخت: ${yearBuilt}
- شهر: ${city}
- محله: ${neighborhood}
- امکانات: ${featureLabels}

لطفا خروجی را با فرمت JSON دقیق با کلیدهای زیر برگردان:
1. estimatedPrice (تخمین قیمت متوسط به تومان به صورت متنی مثلا "۴۵ میلیارد تومان")
2. estimatedRange (بازه قیمت معقول مثلا "۴۳ تا ۴۷ میلیارد تومان")
3. analysis (یک پاراگراف کوتاه تحلیل کارشناسی فارسی درباره دلایل این قیمت‌گذاری بر اساس نرخ منطقه، سال ساخت و مشاعات)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedPrice: { type: Type.STRING },
            estimatedRange: { type: Type.STRING },
            analysis: { type: Type.STRING }
          },
          required: ["estimatedPrice", "estimatedRange", "analysis"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Estimate Price error:", error);
    res.status(500).json({ error: error.message || "خطا در تخمین قیمت ملک" });
  }
});

// 3. Smart Search Parsed Filter Endpoint
app.post("/api/gemini/smart-search", async (req, res) => {
  const { query } = req.body;

  if (!ai) {
    // Baseline parsing for demo if API Key is missing
    const isRent = query.includes('اجاره') || query.includes('رهن') || query.includes('کرایه');
    const hasNiavaran = query.includes('نیاوران');
    const hasSadatAbad = query.includes('سعادت');
    const isCommercial = query.includes('تجاری') || query.includes('دفتر') || query.includes('مغازه');
    
    return res.json({
      filters: {
        transactionType: isRent ? 'rent' : 'buy',
        city: 'تهران',
        neighborhood: hasNiavaran ? 'نیاوران' : hasSadatAbad ? 'سعادت‌آباد' : undefined,
        type: isCommercial ? 'commercial' : 'apartment'
      },
      fallback: true
    });
  }

  try {
    const prompt = `شما یک جستجوگر هوشمند املاک در ایران هستید. عبارت جستجوی کاربر به زبان فارسی را تحلیل کنید و فیلترهای جستجوی متناسب را به صورت JSON استخراج کنید.
عبارت کاربر: "${query}"

امکان استخراج فیلترهای زیر وجود دارد (در صورت عدم ذکر در عبارت کاربر، کلید را حذف یا null بگذارید):
- transactionType: رهن و اجاره -> "rent", خرید یا فروش یا رهن کامل -> "buy"
- type: آپارتمان یا خانه -> "apartment", ویلا یا مستغلات -> "villa", تجاری یا مغازه یا اداری -> "commercial", زمین -> "land"
- city: نام شهر (مثلاً "تهران"، "اصفهان"، "شیراز" یا "مشهد")
- neighborhood: محله ذکر شده (مانند "نیاوران"، "سعادت‌آباد"، "مرداویج"، "قصرالدشت" و غیره)
- minPrice: حداقل قیمت به تومان (عدد انگلیسی)
- maxPrice: حداکثر قیمت به تومان (عدد انگلیسی)
- minArea: حداقل متراژ به متر مربع (عدد انگلیسی)
- maxArea: حداکثر متراژ به متر مربع (عدد انگلیسی)
- minRooms: حداقل تعداد اتاق خواب (عدد انگلیسی)
- parking: در صورت ذکر پارکینگ به صورت مثبت true
- elevator: در صورت ذکر آسانسور به صورت مثبت true
- pool: در صورت ذکر استخر به صورت مثبت true

لطفا فیلترها را استخراج کرده و به عنوان یک شیء JSON با ساختار { filters: ... } پاسخ دهید.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            filters: {
              type: Type.OBJECT,
              properties: {
                transactionType: { type: Type.STRING },
                type: { type: Type.STRING },
                city: { type: Type.STRING },
                neighborhood: { type: Type.STRING },
                minPrice: { type: Type.NUMBER },
                maxPrice: { type: Type.NUMBER },
                minArea: { type: Type.NUMBER },
                maxArea: { type: Type.NUMBER },
                minRooms: { type: Type.NUMBER },
                parking: { type: Type.BOOLEAN },
                elevator: { type: Type.BOOLEAN },
                pool: { type: Type.BOOLEAN }
              }
            }
          },
          required: ["filters"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Smart Search parsing error:", error);
    res.status(500).json({ error: error.message || "خطا در تحلیل هوشمند جستجو" });
  }
});

// 4. Chat Advisor Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!ai) {
    // Dynamic Farsi fallback simulation
    const lowercase = message.toLowerCase();
    let reply = "من دستیار هوشمند آشیون هستم. خوشحال می‌شوم در زمینه خرید، فروش، اجاره و تحلیل قیمت ملک در محله‌های مختلف ایران شما را راهنمایی کنم. بفرمایید به چه اطلاعاتی نیاز دارید؟";
    if (lowercase.includes("نیاوران") || lowercase.includes("تهران")) {
      reply = "محله نیاوران تهران یکی از لوکس‌ترین و خوش‌آب‌وهواترین مناطق منطقه ۱ است. میانگین قیمت آپارتمان مسکونی در این محدوده از متری ۱۵۰ میلیون تومان آغاز شده و در برج‌های مدرن و سوپرلوکس به متری ۳۵۰ میلیون تومان و بالاتر می‌رسد. امکاناتی نظیر مشاعات هتلینگ تأثیر زیادی بر قیمت دارند.";
    } else if (lowercase.includes("سند") || lowercase.includes("قوانین")) {
      reply = "هنگام خرید املاک ملکی حتماً وضعیت سند (تک‌برگ شخصی یا اوقافی/ریشه‌دار بودن) را بررسی کنید. همچنین مفاصاحساب شهرداری، مالیات نقل و انتقال و استعلام از اداره ثبت اسناد از ضرورت‌های یک معامله ایمن در دفاتر اسناد رسمی است.";
    } else if (lowercase.includes("اصفهان") || lowercase.includes("مرداویج")) {
      reply = "مرداویج اصفهان یکی از اصیل‌ترین و گران‌ترین محله‌ها در جنوب اصفهان (منطقه ۶) است. به دلیل پهنای گذر خیابان‌ها و نزدیکی به کوه صفه و دسترسی‌های عالی، تقاضای رهن و اجاره و خرید ملک در مرداویج بسیار بالا می‌باشد.";
    }
    return res.json({ text: reply, fallback: true });
  }

  try {
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: h.content }]
    }));

    // Create a chat instance
    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `شما «آشیون‌یار» دستیار هوش مصنوعی فوق حرفه‌ای سامانه مسکن آشیون (Ashioon) هستید.
وظیفه شما راهنمایی مشتریان در زمینه‌های زیر به صورت صمیمانه، محترمانه و دقیق به زبان فارسی است:
1. تحلیل بازار مسکن شهرهای ایران (تهران، اصفهان، شیراز و مشهد)
2. قوانین بستن قرارداد (رهن، اجاره، سندهای ملکی، داوری و کمیسیون)
3. مشاوره خرید یا سرمایه‌گذاری بر اساس بودجه‌های فرضی
4. معرفی محله‌های گوناگون و ویژگی‌های اجتماعی-اقتصادی آن‌ها.

تا حد امکان از پاسخ‌های منظم، همراه با لیست‌های بالت‌پوینت استفاده کنید. از اصطلاحات مشاوره‌ای معقول ایرانی (مانند سند تک‌برگ، کمیسیون قانونی، رهن کامل) سود بجویید.`,
      },
      history: formattedHistory
    });

    const response = await chatInstance.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Chatbot error:", error);
    res.status(500).json({ error: error.message || "خطا در پردازش گفتگوی هوشمند" });
  }
});

// Configure Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ashioon backend running on port http://localhost:${PORT}`);
  });
}

startServer();
