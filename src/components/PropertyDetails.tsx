/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property } from '../types';
import {
  X, MapPin, Maximize2, Bed, Calendar, Check, ShieldCheck, Phone,
  MessageCircle, Sparkles, AlertCircle, Share2, QrCode, ArrowLeft, Landmark, Coins
} from 'lucide-react';

interface PropertyDetailsProps {
  property: Property;
  onClose: () => void;
}

export default function PropertyDetails({ property, onClose }: PropertyDetailsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'calculator' | 'ai-analysis'>('details');
  const [selectedImage, setSelectedImage] = useState(property.images[0]);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Mortgage Calculator state
  const [mortgageRate, setMortgageRate] = useState(23); // Percentage (Iranian average bank mortgage rate)
  const [loanTerm, setLoanTerm] = useState(12); // Term in years
  const [downPaymentPercent, setDownPaymentPercent] = useState(50); // Down payment %
  
  // Commission state
  const [commissionState, setCommissionState] = useState<string>('');

  // AI Estimate state
  const [aiEstimate, setAiEstimate] = useState<any>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  // Computed Mortgage Values
  const propertyPrice = property.price;
  const downPayment = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPayment;
  // Simple monthly mortgage payment formula
  const monthlyRate = (mortgageRate / 100) / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = loanAmount > 0 
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    : 0;

  // Handle Share copy
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Request price estimation from backend
  const fetchPriceEstimate = async () => {
    setLoadingEstimate(true);
    try {
      const response = await fetch('/api/gemini/estimate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: property.type,
          transactionType: property.transactionType,
          area: property.area,
          rooms: property.rooms,
          yearBuilt: property.yearBuilt,
          neighborhood: property.neighborhood,
          city: property.city,
          features: property.features
        })
      });

      if (!response.ok) throw new Error('خطا در محاسبه ارزش واقعی');
      const data = await response.json();
      setAiEstimate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEstimate(false);
    }
  };

  const calculateCommission = () => {
    // Iranian standard legal commission is 0.25% of purchase from each side + 9% VAT
    const baseCommission = propertyPrice * 0.0025;
    const vat = baseCommission * 0.09;
    const totalCommission = baseCommission + vat;
    setCommissionState(`حق کمیسیون قانونی معامله خرید برای هر طرف معامله: ${totalCommission.toLocaleString('fa-IR')} تومان (شامل ۰.۲۵٪ کمیسیون پایه و ۹٪ مالیات ارزش افزوده)`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Sticky Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              id="details-back-btn"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md">
                جزئیات کامل ملک • شناسه {property.id}
              </span>
              <h1 className="text-base md:text-lg font-black text-slate-900 mt-1 line-clamp-1">{property.title}</h1>
            </div>
          </div>
          <button
            id="details-close-btn"
            onClick={onClose}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner scrollable pane */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Main Visual Carousel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                {/* 360 virtual tour placeholder banner */}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/50 flex items-center gap-2 text-[11px] font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  <span>تور مجازی ۳۶۰ درجه به‌زودی فعال می‌شود</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === img ? 'border-emerald-500 scale-95 shadow-md' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="نمای داخلی ملک" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick specifications and contact action buttons */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">لوکیشن دقیق:</p>
                <p className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {property.city}، {property.neighborhood}
                </p>

                <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-200 text-xs mb-6">
                  <div>
                    <span className="text-slate-400 block mb-1">متراژ:</span>
                    <span className="font-extrabold text-slate-800 flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" />
                      {property.area} متر مربع
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">تعداد اتاق:</span>
                    <span className="font-extrabold text-slate-800 flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5" />
                      {property.rooms} خواب مستر
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">سال ساخت:</span>
                    <span className="font-extrabold text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {property.yearBuilt} شمسی
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">نوع سند:</span>
                    <span className="font-extrabold text-slate-800">{property.documentType}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs text-slate-400 font-bold block mb-1">قیمت کارشناسی آشیون:</span>
                  {property.transactionType === 'buy' ? (
                    <span className="text-xl font-black text-emerald-600 block">
                      {(property.price / 1000000000).toLocaleString('fa-IR')} میلیارد تومان
                    </span>
                  ) : (
                    <div className="text-sm font-extrabold text-slate-800 space-y-1">
                      <p>رهن مسکن: {(property.price / 100000000).toFixed(1)} میلیارد تومان</p>
                      <p>اجاره ماهیانه: {property.rentPrice?.toLocaleString('fa-IR')} تومان</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={property.agent.avatar} alt={property.agent.name} className="w-11 h-11 rounded-full object-cover" />
                    <span className="absolute bottom-0 left-0 bg-emerald-500 text-white p-0.5 rounded-full border border-white">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-xs text-slate-800">{property.agent.name}</h4>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold">آژانس معتبر</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{property.agent.agencyName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    id="agent-detail-whatsapp"
                    href={property.agent.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>واتس‌اپ</span>
                  </a>
                  <a
                    id="agent-detail-call"
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>تماس مستقیم</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabbed Section */}
          <div className="border-b border-slate-200">
            <div className="flex gap-4">
              <button
                id="tab-details"
                onClick={() => setActiveTab('details')}
                className={`pb-3 text-xs font-bold border-b-2 transition ${
                  activeTab === 'details' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                توضیحات و امکانات
              </button>
              {property.transactionType === 'buy' && (
                <button
                  id="tab-calculator"
                  onClick={() => setActiveTab('calculator')}
                  className={`pb-3 text-xs font-bold border-b-2 transition ${
                    activeTab === 'calculator' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  محاسبه اقساط و حق کمیسیون
                </button>
              )}
              <button
                id="tab-ai-analysis"
                onClick={() => {
                  setActiveTab('ai-analysis');
                  if (!aiEstimate) fetchPriceEstimate();
                }}
                className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1 ${
                  activeTab === 'ai-analysis' ? 'border-emerald-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                تحلیل ارزش هوش مصنوعی
              </button>
            </div>
          </div>

          {/* Content panels based on tabs */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Features lists */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-3">توضیحات ملک</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                    {property.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 mb-4">امکانات رفاهی و ایمنی ملک</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(property.features).map(([feat, active]) => {
                      const label = feat === 'parking' ? 'پارکینگ اختصاصی سندی'
                        : feat === 'elevator' ? 'آسانسور ویتور ایتالیا'
                        : feat === 'warehouse' ? 'انباری سندی بزرگ'
                        : feat === 'balcony' ? 'بالکن بزرگ و کاربردی'
                        : feat === 'pool' ? 'استخر آب گرم سرپوشیده'
                        : feat === 'sauna' ? 'سونا خشک اختصاصی'
                        : 'جکوزی هیدروماساژ';
                      return (
                        <div
                          key={feat}
                          className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-semibold border ${
                            active
                              ? 'bg-emerald-50/50 text-emerald-800 border-emerald-100'
                              : 'bg-slate-50 text-slate-400 border-slate-100 line-through'
                          }`}
                        >
                          <Check className={`w-4 h-4 ${active ? 'text-emerald-500' : 'text-slate-300'}`} />
                          <span>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Utility Panel: Share, QR code, and report */}
              <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">اشتراک‌گذاری آگهی</h3>
                <div className="flex gap-2">
                  <button
                    id="btn-copy-link"
                    onClick={handleCopyLink}
                    className="flex-1 bg-white border border-slate-200 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition text-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copied ? 'کپی شد!' : 'کپی لینک'}</span>
                  </button>

                  <button
                    id="btn-toggle-qr"
                    onClick={() => setShowQr(!showQr)}
                    className="bg-white border border-slate-200 p-2.5 rounded-xl hover:bg-slate-50 transition"
                    title="نمایش کد QR ملک"
                  >
                    <QrCode className="w-5 h-5 text-slate-700" />
                  </button>
                </div>

                {showQr && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center gap-2 animate-in fade-in duration-200">
                    <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400 border border-slate-200">
                      [بارکد دو بعدی اختصاصی ملک]
                    </div>
                    <span className="text-[10px] text-slate-400">اسکن با موبایل جهت دسترسی سریع</span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200">
                  <button
                    id="btn-report-listing"
                    className="w-full bg-rose-50 border border-rose-100 text-rose-600 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-100 transition flex items-center justify-center gap-1.5"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>گزارش آگهی نادرست یا فروخته شده</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mortgage calculator */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">محاسبه آنلاین اقساط بانکی مسکن</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1">
                      میزان پرداخت نقدی (پیش‌پرداخت): {downPaymentPercent}٪
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{downPayment.toLocaleString('fa-IR')} تومان</span>
                      <span>سهم وام: {loanAmount.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1">
                      نرخ سود تسهیلات بانکی: {mortgageRate}٪
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="30"
                      value={mortgageRate}
                      onChange={(e) => setMortgageRate(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1">
                      مدت بازپرداخت وام: {loanTerm} سال ({numberOfPayments} قسط)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-xs text-slate-400 font-semibold mb-1">قسط ماهانه تخمینی شما:</p>
                  <p className="text-lg font-black text-slate-900">
                    {monthlyPayment > 0 ? Math.round(monthlyPayment).toLocaleString('fa-IR') : '۰'} <span className="text-xs">تومان / ماه</span>
                  </p>
                </div>
              </div>

              {/* Legal Commission calculator */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-500" />
                    <h3 className="font-extrabold text-sm text-slate-900">محاسبه کمیسیون قانونی اتحادیه املاک</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    طبق مصوبه اتحادیه صنف مشاوران املاک کشور، حق کمیسیون معاملات خرید مسکن معادل ۰.۲۵ درصد ارزش کل معامله به اضافه ۹ درصد مالیات ارزش افزوده برای هریک از طرفین خریدار و فروشنده می‌باشد.
                  </p>
                </div>

                <div className="space-y-4 mt-6">
                  <button
                    id="btn-calculate-commission"
                    onClick={calculateCommission}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition"
                  >
                    محاسبه فوری کمیسیون قانونی این ملک
                  </button>

                  {commissionState && (
                    <div className="p-4 bg-white rounded-2xl border border-slate-100 text-xs font-bold text-slate-700 leading-relaxed text-center animate-in fade-in duration-300">
                      {commissionState}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-analysis' && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-3xl text-white space-y-6 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 text-white p-2 rounded-xl">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm">برآورد هوشمند ارزش واقعی ملک با هوش مصنوعی آشیون</h3>
                    <p className="text-[10px] text-emerald-300">طراحی شده توسط مدل پیشرفته Google Gemini 3.5 Flash</p>
                  </div>
                </div>
              </div>

              {loadingEstimate ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-slate-300 font-bold">درحال دریافت پاسخ کارشناسی...</span>
                </div>
              ) : aiEstimate ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">ارزش تخمینی روز بازار:</span>
                      <span className="text-lg font-black text-emerald-400">{aiEstimate.estimatedPrice}</span>
                    </div>
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">بازه قیمت پیشنهادی مناسب:</span>
                      <span className="text-lg font-black text-amber-400">{aiEstimate.estimatedRange}</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700">
                    <h4 className="text-xs font-extrabold text-slate-300 mb-2">تحلیل تخصصی موقعیت و امکانات ملک:</h4>
                    <p className="text-xs text-slate-300 leading-relaxed text-justify whitespace-pre-line">
                      {aiEstimate.analysis}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-slate-400 mb-3">مشکلی در پردازش تحلیل ارزش پیش آمد.</p>
                  <button
                    id="btn-retry-estimate"
                    onClick={fetchPriceEstimate}
                    className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    تلاش مجدد
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
