/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Property, Agency, CRMLead, Message, Invoice, Notification, SearchFilters
} from './types';
import {
  INITIAL_PROPERTIES, INITIAL_AGENCIES, INITIAL_CRM_LEADS, INITIAL_MESSAGES, INITIAL_NOTIFICATIONS
} from './data';
import AIChatBot from './components/AIChatBot';
import MapSection from './components/MapSection';
import PropertyCard from './components/PropertyCard';
import PropertyDetails from './components/PropertyDetails';
import AddPropertyWizard from './components/AddPropertyWizard';
import AgencyDashboard from './components/AgencyDashboard';
import AdminPanel from './components/AdminPanel';
import HeroSection from './components/HeroSection';
import {
  Sparkles, Search, Sliders, Filter, Compass, Building, ShieldAlert,
  Heart, Landmark, Scale, Plus, Phone, MessageCircle, ArrowLeft, ArrowRight,
  BookOpen, HelpCircle, Mail, MapIcon, BadgePercent, ChevronDown
} from 'lucide-react';

export default function App() {
  // Application view tabs: 'home' | 'dashboard' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'admin'>('home');

  // State
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [agencies, setAgencies] = useState<Agency[]>(INITIAL_AGENCIES);
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>(INITIAL_CRM_LEADS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'inv-1', amount: 500000, description: 'تمدید اشتراک طلایی یک‌ماهه', status: 'paid', date: '۱۴۰۵/۰۳/۲۰', type: 'subscription' },
    { id: 'inv-2', amount: 150000, description: 'نردبان فوری ملک نیاوران', status: 'paid', date: '۱۴۰۵/۰۴/۰۱', type: 'ad_boost' }
  ]);

  // Current logged in agency context (Default to agency-1 for visual demo)
  const [agencyContext, setAgencyContext] = useState<Agency | null>(INITIAL_AGENCIES[0]);

  // Interaction State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['prop-1']);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [showCompareTray, setShowCompareTray] = useState(false);

  // Search Filters
  const [filters, setFilters] = useState<SearchFilters>({});
  const [activeSearchFilters, setActiveSearchFilters] = useState<SearchFilters>({});

  // Collapsible FAQ state
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Toggle comparison property
  const handleToggleCompare = (property: Property) => {
    setCompareList((prev) => {
      const exists = prev.find((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 3) {
        alert('حداکثر می‌توانید ۳ ملک را همزمان مقایسه نمایید.');
        return prev;
      }
      return [...prev, property];
    });
    setShowCompareTray(true);
  };

  // Apply filters manually
  const handleApplyFilters = () => {
    setActiveSearchFilters({ ...filters });
  };

  // Add new property
  const handleAddProperty = (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);
    // Prepend a notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'آگهی جدید با موفقیت ثبت شد',
      description: `ملک «${newProperty.title}» روی سامانه منتشر گردید.`,
      type: 'success',
      date: 'هم‌اکنون',
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Admin approvals
  const handleApproveAgency = (agencyId: string) => {
    setAgencies((prev) =>
      prev.map((ag) =>
        ag.id === agencyId
          ? { ...ag, verificationStatus: 'verified', isVerified: true }
          : ag
      )
    );
    // Sync the local agencyContext too if it's the approved one
    if (agencyContext && agencyContext.id === agencyId) {
      setAgencyContext({
        ...agencyContext,
        verificationStatus: 'verified',
        isVerified: true
      });
    }
  };

  const handleRejectAgency = (agencyId: string) => {
    setAgencies((prev) =>
      prev.map((ag) =>
        ag.id === agencyId
          ? { ...ag, verificationStatus: 'rejected', isVerified: false }
          : ag
      )
    );
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  // CRM status changes
  const handleUpdateLeadStatus = (leadId: string, newStatus: CRMLead['status']) => {
    setCrmLeads((prev) =>
      prev.map((ld) => (ld.id === leadId ? { ...ld, status: newStatus } : ld))
    );
  };

  // Filter properties in real time based on active filters
  const filteredProperties = properties.filter((prop) => {
    const f = activeSearchFilters;
    if (f.city && prop.city !== f.city) return false;
    if (f.type && prop.type !== f.type) return false;
    if (f.transactionType && prop.transactionType !== f.transactionType) return false;
    if (f.minArea && prop.area < f.minArea) return false;
    if (f.maxArea && prop.area > f.maxArea) return false;
    if (f.minRooms && prop.rooms < f.minRooms) return false;

    // Advanced amenity check
    if (f.parking && !prop.features.parking) return false;
    if (f.elevator && !prop.features.elevator) return false;
    if (f.warehouse && !prop.features.warehouse) return false;
    if (f.pool && !prop.features.pool) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      
      {/* Primary Navigation Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 text-white p-2.5 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">آشیون <span className="text-emerald-500">| Ashioon</span></span>
              <p className="text-[9px] text-slate-400 font-bold -mt-1 uppercase tracking-wider">سایت هوشمند معاملات مسکن ایران</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              id="nav-home-btn"
              onClick={() => setCurrentView('home')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'home' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              صفحه اصلی سایت
            </button>
            <button
              id="nav-dash-btn"
              onClick={() => setCurrentView('dashboard')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'dashboard' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              پنل مشاورین و آژانس‌ها
            </button>
            <button
              id="nav-admin-btn"
              onClick={() => setCurrentView('admin')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'admin' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              پنل مدیریت کل (ادمین)
            </button>
          </nav>

          {/* Quick Trigger Button / Call to Action */}
          <div className="flex items-center gap-3">
            <button
              id="header-add-property-btn"
              onClick={() => setShowWizard(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-2xl text-xs transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>ثبت سریع ملک</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Core Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 w-full space-y-12">
        
        {/* VIEW: HOME MAIN VIEW */}
        {currentView === 'home' && (
          <div className="space-y-12">
            
            {/* Elegant Hero Slider & Filter Block */}
            <HeroSection
              filters={filters}
              onChangeFilters={setFilters}
              onSearch={handleApplyFilters}
            />

            {/* Quick Metrics Statistics Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm text-center">
              <div>
                <span className="text-xl md:text-2xl font-black text-slate-900">۱,۴۲۰ +</span>
                <p className="text-[10px] text-slate-400 font-bold mt-1">قرارداد موفق خرید و رهن</p>
              </div>
              <div className="border-r border-slate-100">
                <span className="text-xl md:text-2xl font-black text-emerald-500">۲۴ ساعت</span>
                <p className="text-[10px] text-slate-400 font-bold mt-1">پشتیبانی آنلاین آشیون‌یار</p>
              </div>
              <div className="border-r border-slate-100">
                <span className="text-xl md:text-2xl font-black text-slate-900">۳۵ آژانس</span>
                <p className="text-[10px] text-slate-400 font-bold mt-1">همکار معتبر و تایید شده</p>
              </div>
              <div className="border-r border-slate-100">
                <span className="text-xl md:text-2xl font-black text-slate-900">۱۰۰٪ واقعی</span>
                <p className="text-[10px] text-slate-400 font-bold mt-1">تضمین اصالت اسناد و مدارک</p>
              </div>
            </div>

            {/* Two Column Layout: Left (Property listings), Right (Interactive Map) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Property Listings Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-sm md:text-base">
                      برترین و مناسب‌ترین آگهی‌های پیشنهادی امروز
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">بر اساس فیلترهای جستجوی جادویی شما ({filteredProperties.length} مورد یافت شد)</p>
                  </div>
                </div>

                {filteredProperties.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-400 font-bold bg-white rounded-3xl border border-slate-200">
                    هیچ ملکی با فیلترهای اعمال شده تطابق ندارد. لطفاً فیلترها را ریست کنید.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        onSelect={setSelectedProperty}
                        isFavorite={favorites.includes(prop.id)}
                        onToggleFavorite={handleToggleFavorite}
                        isComparing={!!compareList.find((p) => p.id === prop.id)}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Interactive Leaflet Simulated Map Column */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-500 animate-spin-slow" />
                    <span>موقعیت جغرافیایی املاک روی نقشه ایران</span>
                  </h3>
                </div>

                <MapSection
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={setSelectedProperty}
                />
              </div>

            </div>

            {/* Testimonials from Real Users */}
            <section className="space-y-6 pt-6">
              <h3 className="font-black text-slate-900 text-sm md:text-base text-center">نظرات هموطنان عزیز درباره تجربه استفاده از آشیون</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'دکتر علیرضا کریمی', role: 'پزشک متخصص', text: 'با کمک آشیون‌یار هوشمند توانستیم بهترین آپارتمان را در خیابان نیاوران رهن کنیم. تخمین ارزش قیمت واقعی جمیز کاملا با مشاور محلی همخوانی داشت.' },
                  { name: 'مهندس نازنین افشار', role: 'سرمایه‌گذار املاک', text: 'ثبت مدارک بنگاه و نشان Verified Agency به جذب مشتری‌های بااصالت کمک شایانی کرده است. پنل ادمین سایت فوق‌العاده مدرن طراحی شده.' },
                  { name: 'امیررضا قادری', role: 'کاربر معمولی', text: 'ابزار مقایسه ملک آشیون بینظیر است. مشخصات فنی، امکانات رفاهی و قیمت را به راحتی در کنار هم بررسی کردم.' }
                ].map((user, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-right space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed text-justify">«{user.text}»</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        {user.name[0]}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800">{user.name}</h4>
                        <span className="text-[9px] text-slate-400">{user.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* COLLAPSIBLE FAQ SECTION */}
            <section className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 space-y-6">
              <h3 className="font-black text-slate-900 text-sm md:text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                <span>سوالات متداول کاربران آشیون</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {[
                  { q: 'چگونه آگهی املاک خود را ثبت کنم؟', a: 'کافیست بر روی دکمه ثبت سریع ملک کلیک نمایید، مراحل ویزارد را تکمیل کرده و از هوش مصنوعی آشیون برای نگارش خودکار متن تبلیغاتی ترغیب‌کننده سود ببرید.' },
                  { q: 'آیا تخمین قیمت هوش مصنوعی جمیز دقیق است؟', a: 'بله، مدل Gemini 3.5 Flash با تحلیل عمیق داده‌های لوکیشن، متراژ، سال ساخت و امکانات رفاهی فعال، قیمت منصفانه منطقه را با جزییات و تحلیل کارشناسی تخمین می‌زند.' },
                  { q: 'حق عضویت و احراز اصالت بنگاه چقدر زمان می‌برد؟', a: 'پس از ارسال پروانه کسب معتبر از طریق پنل مشاورین، کارشناسان ادمین ما ظرف مدت کمتر از ۲۴ ساعت صحت مدرک را تایید خواهند نمود.' }
                ].map((faq, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0">
                    <button
                      id={`faq-btn-${i}`}
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="w-full text-right font-bold text-slate-800 text-xs flex justify-between items-center"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                    </button>
                    {faqOpen === i && (
                      <p className="text-[11px] text-slate-500 leading-relaxed text-justify mt-2 animate-in fade-in duration-200">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* VIEW: AGENCY DASHBOARD */}
        {currentView === 'dashboard' && (
          <AgencyDashboard
            properties={properties}
            agency={agencyContext}
            onUpdateAgency={setAgencyContext}
            leads={crmLeads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            messages={messages}
            invoices={invoices}
            onAddPropertyClick={() => setShowWizard(true)}
          />
        )}

        {/* VIEW: ADMIN PANEL */}
        {currentView === 'admin' && (
          <AdminPanel
            agencies={agencies}
            onApproveAgency={handleApproveAgency}
            onRejectAgency={handleRejectAgency}
            properties={properties}
            onDeleteProperty={handleDeleteProperty}
          />
        )}

      </main>

      {/* Floating AI Chat Bot Assistant Widget */}
      <AIChatBot />

      {/* Full detail modal of the property */}
      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Create / Add property wizard wizard */}
      {showWizard && (
        <AddPropertyWizard
          onAddProperty={handleAddProperty}
          onClose={() => setShowWizard(false)}
        />
      )}

      {/* COMPARE SLIDE-UP DRAWER */}
      {compareList.length > 0 && showCompareTray && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white z-40 border-t border-slate-800 shadow-2xl rounded-t-[36px] max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                <h3 className="font-extrabold text-sm">سیستم مقایسه هوشمند املاک منتخب ({compareList.length})</h3>
              </div>
              <div className="flex gap-2">
                <button
                  id="compare-tray-clear"
                  onClick={() => setCompareList([])}
                  className="text-xs text-rose-400 font-bold hover:text-rose-300"
                >
                  حذف همه
                </button>
                <button
                  id="compare-tray-close"
                  onClick={() => setShowCompareTray(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-1 px-3 rounded-lg text-xs"
                >
                  پنهان کردن
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareList.map((prop) => (
                <div key={prop.id} className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={prop.images[0]} alt={prop.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">{prop.title}</h4>
                      <p className="text-[10px] text-slate-400">{prop.neighborhood}، {prop.city}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-300 pt-2 border-t border-slate-700/50">
                    <div className="flex justify-between">
                      <span className="text-slate-400">قیمت ثبت شده:</span>
                      <span className="font-black text-emerald-400">
                        {prop.transactionType === 'buy'
                          ? `${(prop.price / 1000000000).toFixed(1)} میلیارد`
                          : `${(prop.price / 100000000).toFixed(1)} رهن`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">متراژ مسکونی:</span>
                      <span className="font-bold">{prop.area} متر مربع</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">اتاق خواب:</span>
                      <span className="font-bold">{prop.rooms} خواب مستر</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">سال ساخت بنا:</span>
                      <span className="font-bold">{prop.yearBuilt} شمسی</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">امکانات مهم:</span>
                      <span className="font-bold">
                        {Object.entries(prop.features)
                          .filter(([_, active]) => active)
                          .map(([feat]) => feat === 'parking' ? 'پارکینگ' : feat === 'elevator' ? 'آسانسور' : 'استخر')
                          .slice(0, 3)
                          .join('، ')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleCompare(prop)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-xl text-[10px] transition"
                  >
                    حذف از لیست مقایسه
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Primary Visual Brand Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800">
                <Landmark className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-white font-black text-sm">سامانه املاک آشیون</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 text-justify">
              آشیون با تکیه بر الگوریتم‌های هوش مصنوعی مدرن، فرآیند گشت‌وگذار، اصالت‌سنجی و تحلیل کارشناسی قیمت‌ها را تسریع می‌بخشد تا آشیانه‌ای لوکس و امن بیابید.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs mb-4">لینک‌های کاربردی</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('home')} className="hover:text-white transition">صفحه اصلی املاک</button></li>
              <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition">ورود آژانس‌های همکار</button></li>
              <li><button onClick={() => setCurrentView('admin')} className="hover:text-white transition">پنل نظارت ادمین</button></li>
              <li><button onClick={() => setShowWizard(true)} className="hover:text-white transition">ثبت رایگان آگهی</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs mb-4">آژانس‌های برتر تهران</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>املاک بزرگ پارسا (نیاوران)</li>
              <li>دپارتمان بزرگ مهرآئین (شیراز)</li>
              <li>هلدینگ املاک سپاهان (اصفهان)</li>
              <li>دپارتمان املاک نوین شهرک (شهرک غرب)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs mb-4">عضویت در خبرنامه آشیون</h4>
            <p className="text-[11px] text-slate-500">جهت اطلاع از آخرین نوسانات قیمت مسکن ایمیل خود را ثبت کنید.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="آدرس ایمیل شما"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none flex-1"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 rounded-xl text-xs transition">
                عضویت
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 mt-8 border-t border-slate-900 text-center text-[10px] text-slate-600">
          <p>© {new Date().getFullYear()} آشیون | تمامی حقوق مادی و معنوی برای آشیون محفوظ است. مجهز به هوش مصنوعی Google Gemini.</p>
        </div>
      </footer>

    </div>
  );
}
