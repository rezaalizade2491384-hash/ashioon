/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Sparkles, Sliders, Filter, HelpCircle } from 'lucide-react';
import { CITIES_AND_NEIGHBORHOODS } from '../data';
import { SearchFilters } from '../types';

interface HeroSectionProps {
  filters: SearchFilters;
  onChangeFilters: (filters: SearchFilters) => void;
  onSearch: () => void;
}

export default function HeroSection({ filters, onChangeFilters, onSearch }: HeroSectionProps) {
  const [smartQuery, setSmartQuery] = useState('');
  const [loadingSmart, setLoadingSmart] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSmartSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartQuery.trim() || loadingSmart) return;

    setLoadingSmart(true);
    try {
      const response = await fetch('/api/gemini/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: smartQuery })
      });

      if (!response.ok) throw new Error('خطا در تحلیل جستجو');
      const data = await response.json();
      
      // Update filters using the extracted parsed filters from Gemini
      if (data.filters) {
        onChangeFilters({
          ...filters,
          ...data.filters
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSmart(false);
    }
  };

  return (
    <div className="relative bg-slate-900 rounded-[36px] overflow-hidden p-6 md:p-12 text-white border border-slate-800 shadow-2xl">
      {/* Visual background decorations */}
      <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80")' }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/60"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
        {/* Brand visual tag line */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>هوشمندترین سامانه املاک و اسکان ایران</span>
        </span>

        {/* Hero title headings */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-5xl font-black tracking-tight leading-tight">
            آشیانه‌ای رویایی در زیباترین نقطه‌ی ایران بسازید
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium max-w-2xl mx-auto">
            آشیون با تحلیل دقیق بازار مبتنی بر هوش مصنوعی گوگل جمیز، فرآیند خرید، فروش و رهن انواع آپارتمان، ویلا و مستغلات را برای شما ساده‌تر از همیشه می‌کند.
          </p>
        </div>

        {/* Search Engine Selector Box Tabs */}
        <div className="bg-slate-950/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          
          {/* Magic AI Natural Language Search Box Input */}
          <form id="smart-search-form" onSubmit={handleSmartSearchSubmit} className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                id="smart-search-input"
                value={smartQuery}
                onChange={(e) => setSmartQuery(e.target.value)}
                placeholder="به زبان ساده بنویسید (مثال: یک آپارتمان ۳ خوابه لوکس در نیاوران تهران با پارکینگ)..."
                className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl py-3 px-4 pr-11 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 transition"
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            
            <button
              type="submit"
              id="smart-search-submit"
              disabled={loadingSmart || !smartQuery.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black py-3 px-6 rounded-2xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg flex-shrink-0"
            >
              {loadingSmart ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>جستجوی هوشمند هوش مصنوعی</span>
                </>
              )}
            </button>
          </form>

          {/* Quick manual filters panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-right">
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">انـتخـاب شهـر:</label>
              <select
                id="filter-city"
                value={filters.city || ''}
                onChange={(e) => onChangeFilters({ ...filters, city: e.target.value || undefined })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">همه شهرها</option>
                {Object.keys(CITIES_AND_NEIGHBORHOODS).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">نوع معامله:</label>
              <select
                id="filter-transaction"
                value={filters.transactionType || ''}
                onChange={(e) => onChangeFilters({ ...filters, transactionType: e.target.value || undefined })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">همه معاملات</option>
                <option value="buy">خرید و فروش</option>
                <option value="rent">رهن و اجاره</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">دسته‌بندی ملک:</label>
              <select
                id="filter-type"
                value={filters.type || ''}
                onChange={(e) => onChangeFilters({ ...filters, type: e.target.value || undefined })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">همه دسته‌ها</option>
                <option value="apartment">آپارتمان مسکونی</option>
                <option value="villa">ویلاهای لوکس</option>
                <option value="commercial">اداری و تجاری</option>
                <option value="land">مستغلات و زمین</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">حداقل متراژ (متر):</label>
              <input
                type="number"
                id="filter-area"
                value={filters.minArea || ''}
                onChange={(e) => onChangeFilters({ ...filters, minArea: Number(e.target.value) || undefined })}
                placeholder="مثال: ۸۰"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Quick trigger option to show advanced amenities filters */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              id="btn-advanced-filters"
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>فیلترهای پیشرفته‌تر (امکانات رفاهی)</span>
            </button>

            <button
              id="btn-apply-manual-search"
              onClick={onSearch}
              className="bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold px-5 py-2 rounded-xl text-[10px] transition"
            >
              اعمال فیلترهای بالا
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-right animate-in fade-in duration-200">
              {[
                { key: 'parking', label: 'پارکینگ' },
                { key: 'elevator', label: 'آسانسور' },
                { key: 'warehouse', label: 'انباری' },
                { key: 'pool', label: 'استخر' }
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white transition">
                  <input
                    type="checkbox"
                    id={`cb-advanced-${item.key}`}
                    checked={!!(filters as any)[item.key]}
                    onChange={(e) => onChangeFilters({ ...filters, [item.key]: e.target.checked || undefined })}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          )}

        </div>

        {/* Dynamic applied tag indicators */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {Object.entries(filters).map(([k, v]) => {
              if (v === undefined || v === false) return null;
              return (
                <span key={k} className="bg-slate-800 border border-slate-700/50 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                  <span>{k === 'city' ? 'شهر' : k === 'type' ? 'دسته' : k === 'transactionType' ? 'معامله' : k}: {String(v)}</span>
                  <button
                    onClick={() => onChangeFilters({ ...filters, [k]: undefined })}
                    className="hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
