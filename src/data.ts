/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, Agency, CRMLead, Message, Notification } from './types';

export const CITIES_AND_NEIGHBORHOODS: Record<string, string[]> = {
  'تهران': ['نیاوران', 'فرشته', 'زعفرانیه', 'سعادت‌آباد', 'پاسداران', 'شهرک غرب', 'تهرانپارس', 'ونک', 'یوسف‌آباد'],
  'اصفهان': ['مرداویج', 'مهرآباد', 'خاقانی', 'جلفا', 'چهارباغ بالابین', 'آبشار سوم', 'بزرگمهر'],
  'شیراز': ['قصرالدشت', 'معالی‌آباد', 'عفیف‌آباد', 'ارم', 'قدوسی غربی', 'فرهنگ‌شهر'],
  'مشهد': ['سجاد', 'احمدآباد', 'هاشمیه', 'وکیل‌آباد', 'طرقبه', 'کوهسنگی']
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'آپارتمان مدرن و لوکس کلید نخورده در قلب نیاوران',
    description: 'یک واحد استثنایی در برترین فرعی نیاوران. سازه‌ای مارک‌دار از سازنده بنام منطقه. نورگیری فوق‌العاده از ۳ جهت، متریال تماماً برند وارداتی، آشپزخانه فول فرنیش بوش، ارتفاع سقف ۳.۸۰ متر، تراس قابل چیدمان و بدون مشرف با ویوی ابدی کوهستان. ۳ خواب مستر کینگ روم به همراه کلوزت بزرگ. فول مشاعات هتلینگ شامل استخر، سونا، جکوزی فعال، سالن اجتماعات مجلل و لابی‌من ۲۴ ساعته.',
    type: 'apartment',
    transactionType: 'buy',
    price: 48000000000, // 48 میلیارد تومان
    area: 240,
    rooms: 3,
    yearBuilt: 1402,
    city: 'تهران',
    region: 'منطقه ۱',
    neighborhood: 'نیاوران',
    address: 'نیاوران، خیابان یاسر، کوچه گلسار، پلاک ۱۲',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      parking: true,
      elevator: true,
      warehouse: true,
      balcony: true,
      pool: true,
      sauna: true,
      jacuzzi: true
    },
    documentType: 'سند تک‌برگ شخصی',
    buildingDirection: 'south',
    status: 'active',
    lat: 35.8123,
    lng: 51.4654,
    agent: {
      id: 'agent-1',
      name: 'مهندس بردیا راستین',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      phone: '09121234567',
      whatsapp: 'https://wa.me/989121234567',
      agencyName: 'املاک بزرگ پارسا',
      isVerified: true
    },
    createdAt: '2026-06-25T14:30:00Z'
  },
  {
    id: 'prop-2',
    title: 'ویلای سوپرلاکچری با ویوی بی‌نظیر باغ و استخر در قصرالدشت',
    description: 'عمارت رویایی در خوش‌نام‌ترین کوچه باغ قصرالدشت شیراز. ۱۰۰۰ متر زمین با ۵۰۰ متر بنای تریپلکس. طراحی آرشیتکت معروف ایران. دارای استخر روباز آب‌گرم چهارفصل، جکوزی معلق، محوطه‌سازی ژاپنی رویایی با درختان کهنسال. سیستم تمام هوشمند صوتی و تصویری و امنیتی، سنسورهای هوشمند سراسری. سالن سینمای اختصاصی مجهز، باشگاه ورزشی خصوصی و روف‌گاردن ۳۶۰ درجه.',
    type: 'villa',
    transactionType: 'buy',
    price: 85000000000, // 85 میلیارد تومان
    area: 500,
    rooms: 5,
    yearBuilt: 1399,
    city: 'شیراز',
    region: 'منطقه ۱',
    neighborhood: 'قصرالدشت',
    address: 'شیراز، قصرالدشت، کوچه باغ ۲۲، پلاک ۸',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      parking: true,
      elevator: true,
      warehouse: true,
      balcony: true,
      pool: true,
      sauna: true,
      jacuzzi: true
    },
    documentType: 'سند تک‌برگ ملکی',
    buildingDirection: 'north',
    status: 'active',
    lat: 29.6341,
    lng: 52.5122,
    agent: {
      id: 'agent-2',
      name: 'امیرحسین رضایی',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      phone: '09171234567',
      whatsapp: 'https://wa.me/989171234567',
      agencyName: 'دپارتمان بزرگ مهرآئین',
      isVerified: true
    },
    createdAt: '2026-06-28T10:15:00Z'
  },
  {
    id: 'prop-3',
    title: 'رهن و اجاره آپارتمان مدرن فول امکانات در مرداویج',
    description: 'واحدی خوش‌نقشه و سرتاسر غرق در نور در محله اعیان‌نشین مرداویج اصفهان. دارای ۲ پارکینگ سندی، لابی مجلل، نگهبانی شبانه‌روزی، سیستم گرمایش و سرمایش چیلر مرکزی، آسانسور ویتور ایتالیایی با کابین تمام استیل گلد. تراس بزرگ مسقف قابل چیدمان رو به آفتاب. لوکیشن عالی با دسترسی آنی به مراکز تجاری مرداویج.',
    type: 'apartment',
    transactionType: 'rent',
    price: 1200000000, // رهن: ۱.۲ میلیارد تومان
    rentPrice: 25000000, // اجاره: ۲۵ میلیون تومان
    area: 175,
    rooms: 3,
    yearBuilt: 1401,
    city: 'اصفهان',
    region: 'منطقه ۶',
    neighborhood: 'مرداویج',
    address: 'اصفهان، مرداویج، خیابان شیخ کلینی، کوچه کاج، پلاک ۵',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      parking: true,
      elevator: true,
      warehouse: true,
      balcony: true,
      pool: false,
      sauna: false,
      jacuzzi: false
    },
    documentType: 'سند تک‌برگ شخصی',
    buildingDirection: 'double',
    status: 'active',
    lat: 32.6134,
    lng: 51.6644,
    agent: {
      id: 'agent-3',
      name: 'مهندس رویا اسدی',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      phone: '09131234567',
      whatsapp: 'https://wa.me/989131234567',
      agencyName: 'هلدینگ املاک سپاهان',
      isVerified: true
    },
    createdAt: '2026-06-29T18:45:00Z'
  },
  {
    id: 'prop-4',
    title: 'دفتر کار تجاری اداری فلت مدرن در پاسداران',
    description: 'یک موقعیت اداری بینظیر در بهترین فرعی خیابان پاسداران. کاملا فلت با قابلیت پارتیشن‌بندی دلخواه. سند اداری تک‌برگ شخصی، ۲ پارکینگ اختصاصی سندی به همراه پارکینگ مهمان نامحدود. لابی شیک، ۳ لاین آسانسور پرسرعت، سیستم امنیتی پیشرفته دوربین مداربسته و حراست ۲۴ ساعته. موقعیت مکانی استثنایی با دسترسی فوق‌العاده به اتوبان همت و صیاد شیرازی.',
    type: 'commercial',
    transactionType: 'buy',
    price: 29000000000, // ۲۹ میلیارد تومان
    area: 120,
    rooms: 2,
    yearBuilt: 1398,
    city: 'تهران',
    region: 'منطقه ۳',
    neighborhood: 'پاسداران',
    address: 'تهران، پاسداران، نبش گلستان چهارم، برج تجاری پارادایس، طبقه ۵',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      parking: true,
      elevator: true,
      warehouse: true,
      balcony: false,
      pool: false,
      sauna: false,
      jacuzzi: false
    },
    documentType: 'سند اداری ملکی',
    buildingDirection: 'east',
    status: 'active',
    lat: 35.7645,
    lng: 51.4589,
    agent: {
      id: 'agent-1',
      name: 'مهندس بردیا راستین',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      phone: '09121234567',
      whatsapp: 'https://wa.me/989121234567',
      agencyName: 'املاک بزرگ پارسا',
      isVerified: true
    },
    createdAt: '2026-06-30T09:20:00Z'
  },
  {
    id: 'prop-5',
    title: 'زمین مسکونی با پرواز جواز ساخت در شهرک غرب',
    description: 'یک قطعه زمین مسکونی استثنایی به مساحت ۵۰۰ متر مربع در بهترین فرعی فاز ۲ شهرک غرب تهران. ابعاد ۲۰ در ۲۵ متر، گذر کوچه ۱۶ متری، ملک جنوبی با بر فوق‌العاده. دارای دستور نقشه با جواز ساخت ۵ طبقه مسکونی روی پیلوت. سند شخصی تک برگ بدون ریشه شاهنشاهی یا اوقافی، کاملاً آماده انتقال.',
    type: 'land',
    transactionType: 'buy',
    price: 150000000000, // ۱۵۰ میلیارد تومان
    area: 500,
    rooms: 0,
    yearBuilt: 1400,
    city: 'تهران',
    region: 'منطقه ۲',
    neighborhood: 'شهرک غرب',
    address: 'تهران، شهرک غرب، فاز ۲، خیابان هرمزان، کوچه نهم',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      parking: false,
      elevator: false,
      warehouse: false,
      balcony: false,
      pool: false,
      sauna: false,
      jacuzzi: false
    },
    documentType: 'سند تک‌برگ شخصی',
    buildingDirection: 'south',
    status: 'active',
    lat: 35.7533,
    lng: 51.3654,
    agent: {
      id: 'agent-4',
      name: 'مهندس سام نوری',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      phone: '09129876543',
      whatsapp: 'https://wa.me/989129876543',
      agencyName: 'دپارتمان املاک نوین شهرک',
      isVerified: true
    },
    createdAt: '2026-06-27T11:00:00Z'
  }
];

export const INITIAL_AGENCIES: Agency[] = [
  {
    id: 'agency-1',
    name: 'املاک بزرگ پارسا',
    managerName: 'علیرضا پارسا نژاد',
    nationalId: '0019876543',
    licenseNumber: '۱۴۰۲/۳۳۹۸۷',
    phone: '۰۲۱-۲۲۰۰۳۳۴۴',
    province: 'تهران',
    city: 'تهران',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    verificationStatus: 'verified',
    createdAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'agency-2',
    name: 'دپارتمان بزرگ مهرآئین',
    managerName: 'حسین مهرآئین شیرازی',
    nationalId: '2298765432',
    licenseNumber: '۱۳۹۹/۴۴۹۱۲',
    phone: '۰۷۱-۳۶۲۸۹۰۹۰',
    province: 'فارس',
    city: 'شیراز',
    logo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    verificationStatus: 'verified',
    createdAt: '2026-02-15T09:30:00Z'
  },
  {
    id: 'agency-3',
    name: 'هلدینگ املاک سپاهان',
    managerName: 'مهرداد سپاهانی راد',
    nationalId: '1289876543',
    licenseNumber: '۱۴۰۱/۷۷۸۹۰',
    phone: '۰۳۱-۳۶۶۱۷۰۷۰',
    province: 'اصفهان',
    city: 'اصفهان',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=150&q=80',
    isVerified: false,
    verificationStatus: 'pending',
    createdAt: '2026-06-20T11:00:00Z'
  }
];

export const INITIAL_CRM_LEADS: CRMLead[] = [
  {
    id: 'lead-1',
    clientName: 'مهندس فرزین تهرانی',
    clientPhone: '09121112233',
    propertyName: 'آپارتمان مدرن و لوکس کلید نخورده در نیاوران',
    propertyPrice: '۴۸ میلیارد تومان',
    status: 'negotiation',
    date: '۱۴۰۵/۰۴/۰۹',
    notes: 'مشتری ملک یاسر نیاوران را بازدید کرده و بسیار پسندیده است. در حال مذاکره برای تخفیف ۱ میلیارد تومانی و نحوه پرداخت سه مرحله‌ای هستیم.'
  },
  {
    id: 'lead-2',
    clientName: 'دکتر سارا فرهادی',
    clientPhone: '09174445566',
    propertyName: 'ویلای سوپرلاکچری در قصرالدشت شیراز',
    propertyPrice: '۸۵ میلیارد تومان',
    status: 'visit',
    date: '۱۴۰۵/۰۴/۰۸',
    notes: 'برای روز جمعه ساعت ۱۷ بازدید ملک تنظیم شده است. ایشان تمایل دارند همسرشان هم حتما ویلا را ببینند.'
  },
  {
    id: 'lead-3',
    clientName: 'آقای کامران ملکی',
    clientPhone: '09139998877',
    propertyName: 'آپارتمان فول امکانات در مرداویج اصفهان',
    propertyPrice: '۱.۲ میلیارد رهن + ۲۵ م اجاره',
    status: 'contract',
    date: '۱۴۰۵/۰۴/۱۰',
    notes: 'قولنامه رهن و اجاره تنظیم شده است. فردا صبح برای امضای نهایی و پرداخت پیش‌پرداخت به دفتر تشریف می‌آورند.'
  },
  {
    id: 'lead-4',
    clientName: 'خانم سپیده حسینی',
    clientPhone: '09127778899',
    propertyName: 'زمین مسکونی شهرک غرب',
    propertyPrice: '۱۵۰ میلیارد تومان',
    status: 'lead',
    date: '۱۴۰۵/۰۴/۰۵',
    notes: 'تماس اولیه از روی آگهی سایت برقرار شد. در حال ارسال دستور نقشه و مشخصات زمین روی واتس‌اپ ایشان هستیم.'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderName: 'امید علیزاده',
    senderPhone: '09128889900',
    content: 'سلام وقت بخیر، آیا این آپارتمان نیاوران امکان تهاتر با یک واحد کلنگی در تجریش را دارد؟ شرایط پرداخت را بفرمایید.',
    propertyTitle: 'آپارتمان مدرن و لوکس نیاوران',
    createdAt: '2026-06-30T16:15:00Z',
    isRead: false
  },
  {
    id: 'msg-2',
    senderName: 'زهرا موسوی',
    senderPhone: '09172223344',
    content: 'درود، تخفیف پای معامله برای ویلای قصرالدشت چقدر هست؟ آیا مالک فوراً سند را انتقال می‌دهند؟',
    propertyTitle: 'ویلای سوپرلاکچری در قصرالدشت شیراز',
    createdAt: '2026-06-29T10:30:00Z',
    isRead: true
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'درخواست عضویت آژانس جدید',
    description: '«هلدینگ املاک سپاهان» درخواست عضویت تایید شده در سامانه آشیون را ارسال کرده است.',
    type: 'warning',
    date: '۲ ساعت پیش',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'تایید ملک جدید',
    description: 'آگهی «آپارتمان مدرن نیاوران» شما با موفقیت تایید و در سایت منتشر شد.',
    type: 'success',
    date: '۱ روز پیش',
    isRead: true
  },
  {
    id: 'notif-3',
    title: 'ارتقای اشتراک ویژه',
    description: 'کاربر گرامی، پلن ویژه دپارتمان شما با موفقیت تا تاریخ ۱۴۰۶/۰۴/۰۱ تمدید شد.',
    type: 'info',
    date: '۳ روز پیش',
    isRead: true
  }
];
