/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property } from '../types';
import {
  Sparkles, Check, ChevronRight, ChevronLeft, MapPin, Image as ImageIcon,
  FileText, Home, Layers, Settings, Eye, HelpCircle
} from 'lucide-react';

interface AddPropertyWizardProps {
  onAddProperty: (property: Property) => void;
  onClose: () => void;
}

export default function AddPropertyWizard({ onAddProperty, onClose }: AddPropertyWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form states
  const [transactionType, setTransactionType] = useState<'buy' | 'rent'>('buy');
  const [type, setType] = useState<'apartment' | 'villa' | 'commercial' | 'land'>('apartment');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [rentPrice, setRentPrice] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(1);
  const [yearBuilt, setYearBuilt] = useState<number>(1405);
  const [documentType, setDocumentType] = useState('سند تک‌برگ ملکی');
  const [buildingDirection, setBuildingDirection] = useState<'north' | 'south' | 'east' | 'west' | 'double'>('south');
  const [city, setCity] = useState('تهران');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  
  // Features
  const [parking, setParking] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [warehouse, setWarehouse] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const [pool, setPool] = useState(false);
  const [sauna, setSauna] = useState(false);
  const [jacuzzi, setJacuzzi] = useState(false);

  // Description and Media
  const [description, setDescription] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  // AI states
  const [loadingAiDescription, setLoadingAiDescription] = useState(false);

  // Map simulation
  const [lat, setLat] = useState(35.75);
  const [lng, setLng] = useState(51.4);

  const generateDescriptionWithAI = async () => {
    setLoadingAiDescription(true);
    try {
      const response = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          transactionType,
          area,
          rooms,
          city,
          neighborhood,
          features: { parking, elevator, warehouse, balcony, pool, sauna, jacuzzi },
          customNotes
        })
      });

      if (!response.ok) throw new Error('خطا در هوش مصنوعی');
      const data = await response.json();
      setDescription(data.text);
    } catch (err) {
      console.error(err);
      setDescription('خطایی رخ داد. مجدداً بر روی دکمه تولید با هوش مصنوعی کلیک کنید.');
    } finally {
      setLoadingAiDescription(false);
    }
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleSubmit = () => {
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: title || 'آپارتمان نوساز سوپر لوکس',
      description: description || 'یک فرصت استثنایی خرید مسکن با دسترسی عالی.',
      type,
      transactionType,
      price,
      rentPrice: transactionType === 'rent' ? rentPrice : undefined,
      area,
      rooms,
      yearBuilt,
      city,
      region: 'منطقه ۱',
      neighborhood: neighborhood || 'نیاوران',
      address: address || 'خیابان نیاوران، کوچه گلها، پلاک ۴',
      images,
      features: { parking, elevator, warehouse, balcony, pool, sauna, jacuzzi },
      documentType,
      buildingDirection,
      status: 'active',
      lat,
      lng,
      agent: {
        id: 'agent-current',
        name: 'مدیر دپارتمان آشیون',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        phone: '09121112233',
        whatsapp: 'https://wa.me/989121112233',
        agencyName: 'آژانس مرکزی آشیون',
        isVerified: true
      },
      createdAt: new Date().toISOString()
    };

    onAddProperty(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Wizard Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-white p-2.5 rounded-2xl shadow-md">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black">ثبت هوشمند ملک جدید</h1>
              <p className="text-xs text-slate-400 mt-0.5">مراحل را تکمیل کنید تا آگهی شما با کمک هوش مصنوعی زیباتر شود</p>
            </div>
          </div>
          <button
            id="wizard-close"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
          >
            بستن ×
          </button>
        </div>

        {/* Multi-step progress tracker bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center overflow-x-auto gap-3">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;

            return (
              <div key={stepNum} className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white ring-4 ring-slate-200'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span className={`text-[11px] font-bold ${isActive ? 'text-slate-900 font-black' : 'text-slate-400'}`}>
                  {stepNum === 1 ? 'اطلاعات پایه'
                    : stepNum === 2 ? 'مشخصات فنی'
                    : stepNum === 3 ? 'امکانات رفاهی'
                    : stepNum === 4 ? 'تصاویر'
                    : stepNum === 5 ? 'موقعیت'
                    : 'پیش‌نویس و ثبت'}
                </span>
                {stepNum < totalSteps && <div className="w-6 h-[1.5px] bg-slate-300"></div>}
              </div>
            );
          })}
        </div>

        {/* Wizard Form Scroll Pane */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Step 1: Base info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="font-extrabold text-sm text-slate-800">مرحله اول: نوع معامله و عنوان آگهی</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">نوع واگذاری ملک:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="tx-type-buy"
                      onClick={() => setTransactionType('buy')}
                      className={`py-3 rounded-xl text-xs font-bold border transition ${
                        transactionType === 'buy'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      خرید و فروش ملک
                    </button>
                    <button
                      id="tx-type-rent"
                      onClick={() => setTransactionType('rent')}
                      className={`py-3 rounded-xl text-xs font-bold border transition ${
                        transactionType === 'rent'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      رهن و اجاره خانه
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">نوع کاربری ملک:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['apartment', 'villa', 'commercial', 'land'].map((cat: any) => (
                      <button
                        key={cat}
                        id={`prop-cat-${cat}`}
                        onClick={() => setType(cat)}
                        className={`py-3 rounded-xl text-[10px] font-bold border transition capitalize ${
                          type === cat
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {cat === 'apartment' ? 'آپارتمان' : cat === 'villa' ? 'ویلا' : cat === 'commercial' ? 'اداری' : 'زمین'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1.5">عنوان آگهی (مثال: آپارتمان تکواحدی پاسداران):</label>
                <input
                  type="text"
                  id="wizard-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="یک عنوان جذاب برای جلب توجه خریداران بنویسید"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">
                    {transactionType === 'buy' ? 'قیمت کل پیشنهادی (تومان):' : 'مبلغ رهن قرض‌الحسنه (تومان):'}
                  </label>
                  <input
                    type="number"
                    id="wizard-price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="مبلغ مورد نظر را به تومان وارد کنید"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">
                    معادل: {(price / 10000000).toLocaleString('fa-IR')} میلیون تومان
                  </span>
                </div>

                {transactionType === 'rent' && (
                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1.5">مبلغ اجاره ماهیانه (تومان):</label>
                    <input
                      type="number"
                      id="wizard-rent-price"
                      value={rentPrice}
                      onChange={(e) => setRentPrice(Number(e.target.value))}
                      placeholder="اجاره ماهیانه به تومان"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Technical specifications */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="font-extrabold text-sm text-slate-800">مرحله دوم: مشخصات فنی و سند ملک</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">متراژ مسکونی (متر مربع):</label>
                  <input
                    type="number"
                    id="wizard-area"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">تعداد اتاق خواب:</label>
                  <select
                    id="wizard-rooms"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n === 0 ? 'بدون خواب (سوئیت)' : `${n} خواب`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">سال ساخت بنا:</label>
                  <input
                    type="number"
                    id="wizard-year"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">نوع سند ملکیت:</label>
                  <select
                    id="wizard-doc"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  >
                    <option value="سند تک‌برگ ملکی">سند تک‌برگ شخصی ملکی</option>
                    <option value="سند اوقافی">سند اوقافی (زمین ریشه‌دار)</option>
                    <option value="قولنامه‌ای معتبر">قولنامه‌ای با کد رهگیری</option>
                    <option value="اداری/سرقفلی">سند سرقفلی تجاری</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">جهت جغرافیایی بنا:</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { val: 'north', label: 'شمالی' },
                      { val: 'south', label: 'جنوبی' },
                      { val: 'east', label: 'شرقی' },
                      { val: 'west', label: 'غربی' },
                      { val: 'double', label: 'دو کله' }
                    ].map((d) => (
                      <button
                        key={d.val}
                        id={`direction-${d.val}`}
                        onClick={() => setBuildingDirection(d.val as any)}
                        className={`py-2 rounded-lg text-[10px] font-bold border transition ${
                          buildingDirection === d.val
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="font-extrabold text-sm text-slate-800">مرحله سوم: امکانات و مشاعات رفاهی ملک</h2>
              <p className="text-xs text-slate-400">آیتم‌های موجود در ملک را فعال کنید تا فیلترهای سرچ دقیق به آن نسبت داده شود</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { state: parking, set: setParking, label: 'پارکینگ اختصاصی سندی' },
                  { state: elevator, set: setElevator, label: 'آسـانسور مدرن کابین‌بزرگ' },
                  { state: warehouse, set: setWarehouse, label: 'انباری شخصی سندی' },
                  { state: balcony, set: setBalcony, label: 'بـالکـن / تراس مسقف' },
                  { state: pool, set: setPool, label: 'اسـتخـر آب گرم سرپوشیده' },
                  { state: sauna, set: setSauna, label: 'سـونـا خشک و مرطوب' },
                  { state: jacuzzi, set: setJacuzzi, label: 'جـکـوزی ماساژور فعال' }
                ].map((feat, idx) => (
                  <button
                    key={idx}
                    id={`feat-wizard-toggle-${idx}`}
                    onClick={() => feat.set(!feat.state)}
                    className={`p-4 rounded-2xl border text-right transition flex flex-col justify-between h-24 ${
                      feat.state
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      feat.state ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                    }`}>
                      {feat.state && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-bold">{feat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Images & Media */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="font-extrabold text-sm text-slate-800">مرحله چهارم: گالری تصاویر ملک</h2>
              
              <div className="space-y-3">
                <label className="text-xs text-slate-500 font-bold block">افزودن عکس با لینک اینترنتی:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="wizard-img-input"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... لینک مستقیم تصویر"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                  <button
                    id="wizard-add-img-btn"
                    onClick={handleAddImage}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 rounded-xl font-bold text-xs"
                  >
                    افزودن
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 pt-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200">
                    <img src={img} alt="تصویر آگهی" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 left-1 bg-rose-500 text-white p-1 rounded-full text-xs hover:bg-rose-600 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Location Map selection */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="font-extrabold text-sm text-slate-800">مرحله پنجم: موقعیت جغرافیایی و آدرس دقیق</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">انتخاب شهر مبدأ:</label>
                  <select
                    id="wizard-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  >
                    <option value="تهران">تهران</option>
                    <option value="اصفهان">اصفهان</option>
                    <option value="شیراز">شیراز</option>
                    <option value="مشهد">مشهد</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1.5">محله مسکونی ملک:</label>
                  <input
                    type="text"
                    id="wizard-neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="مثال: نیاوران، عفیف‌آباد، مرداویج"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1.5">آدرس کامل و کوچه پلاک جهت استفاده لابی‌من:</label>
                <textarea
                  id="wizard-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs h-20 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  placeholder="آدرس دقیق ملک را در این بخش بنویسید"
                />
              </div>

              <div className="bg-slate-100 rounded-2xl h-48 border border-slate-200 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                <div className="text-center z-10 p-4 space-y-2">
                  <MapPin className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
                  <p className="text-xs font-bold text-slate-700">موقعیت نقشه شبیه‌سازی شد</p>
                  <p className="text-[10px] text-slate-400 font-medium">مختصات: {lat.toFixed(4)} , {lng.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Smart AI copy description and Preview */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="font-extrabold text-sm text-slate-800">مرحله ششم: توضیحات نهایی و هوش مصنوعی</h2>

              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                    <div>
                      <h3 className="font-extrabold text-xs">نویسنده هوشمند توضیحات آگهی آشیون</h3>
                      <p className="text-[10px] text-slate-400">با یک کلیک، توضیحات خیره‌کننده و حرفه‌ای تولید کنید</p>
                    </div>
                  </div>
                  <button
                    id="btn-generate-ai-desc"
                    onClick={generateDescriptionWithAI}
                    disabled={loadingAiDescription}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black text-[10px] px-3.5 py-2 rounded-xl transition"
                  >
                    {loadingAiDescription ? 'در حال نگارش...' : 'تولید فوری توضیحات'}
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">نکات تکمیلی و سفارشی شما برای هوش مصنوعی (اختیاری):</label>
                  <input
                    type="text"
                    id="wizard-custom-notes"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="مثال: لابی مجلل، همسایگان آرام، مالک منعطف"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-bold block mb-1.5">متن توضیحات آگهی:</label>
                <textarea
                  id="wizard-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs h-32 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition leading-relaxed text-justify"
                  placeholder="مشخصات کلی ملک را بنویسید یا دکمه تولید هوش مصنوعی بالا را بفشارید..."
                />
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-emerald-800">آماده انتشار در سراسر ایران</h4>
                  <p className="text-[11px] text-emerald-700/80 leading-relaxed mt-1">
                    با کلیک روی ثبت نهایی، آگهی املاک شما فورا در دیتابیس لوکال ثبت شده و در صفحه اصلی سایت در اختیار هزاران متقاضی خرید و رهن قرار خواهد گرفت.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation controls */}
        <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center z-10">
          <button
            id="wizard-back-btn"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 text-xs font-bold"
          >
            <ChevronRight className="w-4 h-4" />
            <span>قبلی</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              id="wizard-next-btn"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <span>مرحله بعد</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="wizard-submit-btn"
              onClick={handleSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 px-8 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>انتشار نهایی آگهی در آشیون</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
