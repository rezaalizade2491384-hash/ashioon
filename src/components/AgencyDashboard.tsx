/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property, Agency, CRMLead, Message, Invoice } from '../types';
import {
  Building, User, ShieldAlert, BadgeCheck, FileText, CheckCircle,
  Briefcase, MessageSquare, TrendingUp, DollarSign, Plus, Settings, Eye, Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AgencyDashboardProps {
  properties: Property[];
  agency: Agency | null;
  onUpdateAgency: (agency: Agency) => void;
  leads: CRMLead[];
  onUpdateLeadStatus: (leadId: string, newStatus: CRMLead['status']) => void;
  messages: Message[];
  invoices: Invoice[];
  onAddPropertyClick: () => void;
}

const ANALYTICS_DATA = [
  { name: 'فروردین', بازدید: 2400, تماس: 400, فروش: 2 },
  { name: 'اردیبهشت', بازدید: 3200, تماس: 650, فروش: 4 },
  { name: 'خرداد', بازدید: 5100, تماس: 980, فروش: 5 },
  { name: 'تیر', بازدید: 6800, تماس: 1200, فروش: 8 }
];

export default function AgencyDashboard({
  properties,
  agency,
  onUpdateAgency,
  leads,
  onUpdateLeadStatus,
  messages,
  invoices,
  onAddPropertyClick
}: AgencyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'crm' | 'leads' | 'messages' | 'invoices'>('overview');

  // Verification Form State
  const [agencyName, setAgencyName] = useState(agency?.name || '');
  const [managerName, setManagerName] = useState(agency?.managerName || '');
  const [nationalId, setNationalId] = useState(agency?.nationalId || '');
  const [licenseNumber, setLicenseNumber] = useState(agency?.licenseNumber || '');
  const [phone, setPhone] = useState(agency?.phone || '');
  const [province, setProvince] = useState(agency?.province || 'تهران');
  const [city, setCity] = useState(agency?.city || 'تهران');

  const handleApplyVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAgency: Agency = {
      id: agency?.id || 'agency-curr',
      name: agencyName,
      managerName,
      nationalId,
      licenseNumber,
      phone,
      province,
      city,
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80',
      isVerified: false,
      verificationStatus: 'pending',
      createdAt: agency?.createdAt || new Date().toISOString()
    };
    onUpdateAgency(updatedAgency);
  };

  const formatTomans = (num: number) => {
    return num.toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <div className="bg-slate-50 min-h-screen -mx-4 md:-mx-8 p-4 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar navigation */}
      <div className="w-full md:w-64 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex-shrink-0 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-slate-900 text-white p-2.5 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-800">داشبورد بنگاه</h2>
              <p className="text-[10px] text-slate-400 font-bold">پنل مدیریت آژانس‌های املاک</p>
            </div>
          </div>

          {/* Agency verification quick status */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            {agency?.verificationStatus === 'verified' ? (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-100 flex items-center gap-2 text-[11px] font-black">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                <span>آژانس تایید شده (Verified)</span>
              </div>
            ) : agency?.verificationStatus === 'pending' ? (
              <div className="bg-amber-50 text-amber-800 p-3 rounded-2xl border border-amber-100 flex items-center gap-2 text-[11px] font-black">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>در انتظار تایید مدارک</span>
              </div>
            ) : (
              <div className="bg-rose-50 text-rose-800 p-3 rounded-2xl border border-rose-100 flex items-center gap-2 text-[11px] font-black">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>احراز هویت نشده</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Tabs */}
        <nav className="flex flex-col gap-1.5">
          <button
            id="dash-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeTab === 'overview' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>آمار کلیدها و بازدیدها</span>
          </button>

          <button
            id="dash-tab-crm"
            onClick={() => setActiveTab('crm')}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeTab === 'crm' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>پایپ‌لاین مشتریان (CRM)</span>
          </button>

          <button
            id="dash-tab-verification"
            onClick={() => setActiveTab('verification')}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeTab === 'verification' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            <span>مدارک و احراز هویت</span>
          </button>

          <button
            id="dash-tab-messages"
            onClick={() => setActiveTab('messages')}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeTab === 'messages' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>پیام‌های متقاضیان ملکی</span>
          </button>

          <button
            id="dash-tab-invoices"
            onClick={() => setActiveTab('invoices')}
            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeTab === 'invoices' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>تراکنش‌ها و شارژ کیف پول</span>
          </button>
        </nav>
      </div>

      {/* Main Panel Content Pane */}
      <div className="flex-1 space-y-8">
        
        {/* Overview & Analytics Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-slate-900">عملکرد و آمار بازدیدهای آژانس شما</h2>
              <button
                id="dash-add-prop-btn"
                onClick={onAddPropertyClick}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت آگهی ملکی جدید</span>
              </button>
            </div>

            {/* Performance metric blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">تعداد کل آگهی‌ها:</span>
                  <span className="text-xl font-black text-slate-900">{properties.length} آگهی</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Building className="w-5 h-5 text-slate-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">متقاضیان در انتظار (Leads):</span>
                  <span className="text-xl font-black text-slate-900">{leads.length} پرونده</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">پیام‌های بررسی‌نشده:</span>
                  <span className="text-xl font-black text-slate-900">
                    {messages.filter(m => !m.isRead).length} پیام جدید
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <MessageSquare className="w-5 h-5 text-rose-500" />
                </div>
              </div>
            </div>

            {/* Recharts Performance Visualizer */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-xs text-slate-700">نمودار بازدید کلیدها، تماس‌ها و معاملات نهایی</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ANALYTICS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="بازدید" stroke="#10b981" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Verification Tab Section */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h2 className="font-extrabold text-sm text-slate-900">درخواست احراز هویت دپارتمان املاک</h2>
            
            {agency?.verificationStatus === 'verified' ? (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center space-y-3">
                <BadgeCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-extrabold text-sm text-emerald-900">آژانس املاک شما تایید گردید!</h3>
                <p className="text-xs text-emerald-700/80 max-w-lg mx-auto">
                  تمامی آگهی‌های ثبت شده توسط شما از این پس با نشان متمایز «Verified Agency» در صفحه نخست و نقشه سایت به مراجعین نمایش داده خواهد شد.
                </p>
              </div>
            ) : agency?.verificationStatus === 'pending' ? (
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl text-center space-y-3">
                <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
                <h3 className="font-extrabold text-sm text-amber-900">مدارک شما در حال بررسی کارشناسان است</h3>
                <p className="text-xs text-amber-700/80 max-w-lg mx-auto">
                  اطلاعات پروانه کسب شما با دیتابیس اتحادیه صنف مشاوران املاک کشور تطبیق داده می‌شود. این فرآیند تا حداکثر ۲۴ ساعت به طول می‌انجامد.
                </p>
              </div>
            ) : (
              <form id="verification-form" onSubmit={handleApplyVerification} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1">نام رسمی آژانس املاک:</label>
                    <input
                      type="text"
                      id="v-agency-name"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="املاک بزرگ پارسا"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1">نام و نام‌خانوادگی مدیر مسئول:</label>
                    <input
                      type="text"
                      id="v-manager-name"
                      required
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      placeholder="علیرضا پارسا نژاد"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1">شماره پروانه کسب از اتحادیه:</label>
                    <input
                      type="text"
                      id="v-license"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="مثال: ۱۴۰۲/۳۳۹۸۷"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-bold block mb-1">کد ملی مدیر مسئول:</label>
                    <input
                      type="text"
                      id="v-national-id"
                      required
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="کد ملی ۱۰ رقمی"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-apply-verification"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl text-xs transition shadow-md"
                >
                  ارسال مدارک و درخواست اصالت آژانس
                </button>
              </form>
            )}
          </div>
        )}

        {/* CRM Leads and Deal Pipeline Tab */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <h2 className="font-extrabold text-sm text-slate-900">مدیریت معاملات و پرونده متقاضیان (CRM Pipeline)</h2>
            
            {/* Visual Column Pipelines */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { status: 'lead' as const, title: 'سرنخ‌های اولیه (Lead)', bg: 'bg-indigo-50 border-indigo-100 text-indigo-800' },
                { status: 'visit' as const, title: 'هماهنگی بازدید (Visit)', bg: 'bg-amber-50 border-amber-100 text-amber-800' },
                { status: 'negotiation' as const, title: 'مذاکره نهایی (Negotiation)', bg: 'bg-rose-50 border-rose-100 text-rose-800' },
                { status: 'contract' as const, title: 'تنظیم قرارداد (Contract)', bg: 'bg-teal-50 border-teal-100 text-teal-800' },
                { status: 'closed' as const, title: 'موفق و بسته شد (Closed)', bg: 'bg-emerald-50 border-emerald-100 text-emerald-800' }
              ].map((column) => {
                const columnLeads = leads.filter(l => l.status === column.status);
                
                return (
                  <div key={column.status} className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col h-[420px]">
                    <div className={`p-3 rounded-2xl mb-3 text-[10px] font-black border text-center ${column.bg}`}>
                      {column.title} ({columnLeads.length})
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                      {columnLeads.map((ld) => (
                        <div key={ld.id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition text-right">
                          <p className="text-xs font-black text-slate-800">{ld.clientName}</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-1">تلفن: {ld.clientPhone}</p>
                          <p className="text-[9px] text-indigo-600 font-extrabold mt-1 line-clamp-1">{ld.propertyName}</p>
                          <p className="text-[10px] text-slate-400 mt-2 text-justify line-clamp-2">{ld.notes}</p>
                          
                          {/* Move to next action dropdown selector */}
                          <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-[8px] text-slate-400 font-bold">{ld.date}</span>
                            <select
                              value={ld.status}
                              onChange={(e) => onUpdateLeadStatus(ld.id, e.target.value as any)}
                              className="bg-white border border-slate-200 text-[9px] font-bold rounded-lg p-1"
                            >
                              <option value="lead">Lead</option>
                              <option value="visit">Visit</option>
                              <option value="negotiation">Negotiation</option>
                              <option value="contract">Contract</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Messages list */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="font-extrabold text-sm text-slate-900">پیام‌های دریافتی از آگهی‌های شما</h2>
            <div className="divide-y divide-slate-100">
              {messages.map((msg) => (
                <div key={msg.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-xs text-slate-800">{msg.senderName}</h4>
                      <span className="text-[10px] text-slate-400">{msg.senderPhone}</span>
                      {!msg.isRead && <span className="bg-rose-500 text-white rounded-full w-2 h-2"></span>}
                    </div>
                    {msg.propertyTitle && (
                      <p className="text-[10px] text-indigo-600 font-black mt-1">روی ملک: {msg.propertyTitle}</p>
                    )}
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{msg.content}</p>
                  </div>
                  
                  <span className="text-[10px] text-slate-400 font-bold flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions / Wallet / Invoices */}
        {activeTab === 'invoices' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="font-extrabold text-sm text-slate-900">تاریخچه فاکتورها و خریدهای ویژه</h2>
              <div className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <div key={inv.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800">{inv.description}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">تاریخ: {inv.date}</p>
                    </div>

                    <div className="text-left">
                      <p className="font-black text-slate-900">{formatTomans(inv.amount)}</p>
                      <span className={`inline-block text-[9px] px-2 py-0.5 rounded-md font-bold mt-1 ${
                        inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {inv.status === 'paid' ? 'پرداخت شده' : 'ناموفق'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Panel */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col justify-between shadow-lg h-72">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">اعتبار موجودی دپارتمان:</span>
                <span className="text-2xl font-black text-emerald-400">۱۵,۰۰۰,۰۰۰ تومان</span>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 leading-relaxed text-justify">
                  از کیف پول آشیون برای افزایش بازدید فوری آگهی‌ها (نردبان)، ویژه کردن آگهی و یا تمدید عضویت آژانس‌های معتبر استفاده کنید.
                </p>
                <button
                  id="btn-recharge-wallet"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl text-xs transition"
                >
                  افزایش موجودی آنلاین (زرین‌پال)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
