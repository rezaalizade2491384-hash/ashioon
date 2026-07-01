/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Agency, Property } from '../types';
import { ShieldCheck, UserCheck, CheckCircle2, XCircle, AlertCircle, Trash2, ShieldAlert } from 'lucide-react';

interface AdminPanelProps {
  agencies: Agency[];
  onApproveAgency: (agencyId: string) => void;
  onRejectAgency: (agencyId: string) => void;
  properties: Property[];
  onDeleteProperty: (propertyId: string) => void;
}

export default function AdminPanel({
  agencies,
  onApproveAgency,
  onRejectAgency,
  properties,
  onDeleteProperty
}: AdminPanelProps) {
  const pendingAgencies = agencies.filter((a) => a.verificationStatus === 'pending');

  return (
    <div className="bg-slate-50 min-h-screen -mx-4 md:-mx-8 p-4 md:p-8 space-y-8">
      
      {/* Admin stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <span>سامانه نظارتی و پنل ائتلاف ادمین آشیون</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">مدیریت آژانس‌ها، لیست دارایی‌ها و صف تایید هویت اسناد</p>
        </div>

        <div className="flex gap-3 text-xs">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold">
            کل آگهی‌ها: <span className="text-slate-900">{properties.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold">
            در صف تایید بنگاه: <span className="text-amber-600">{pendingAgencies.length}</span>
          </div>
        </div>
      </div>

      {/* Verification Queue Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <span>صف بررسی صلاحیت بنگاه‌های ثبت نامی جدید ({pendingAgencies.length})</span>
        </h2>

        {pendingAgencies.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-bold bg-slate-50 rounded-2xl border border-slate-100">
            هیچ درخواستی در حال حاضر در صف انتظار کارشناسی نیست.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingAgencies.map((ag) => (
              <div key={ag.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-xs text-slate-900">{ag.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">مدیر مسئول: {ag.managerName}</p>
                  </div>
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md font-bold">در انتظار بررسی</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 py-2 border-y border-slate-200">
                  <div>
                    <span className="text-slate-400">کد ملی مدیر:</span> <span className="font-bold">{ag.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">شماره پروانه کسب:</span> <span className="font-bold">{ag.licenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">شماره تماس:</span> <span className="font-bold">{ag.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">محل فعالیت:</span> <span className="font-bold">{ag.province}، {ag.city}</span>
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div className="flex gap-2">
                  <button
                    id={`approve-agency-${ag.id}`}
                    onClick={() => onApproveAgency(ag.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تایید صلاحیت و ثبت نشان</span>
                  </button>

                  <button
                    id={`reject-agency-${ag.id}`}
                    onClick={() => onRejectAgency(ag.id)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    رد مدارک
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Listings Moderation Board */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="font-extrabold text-sm text-slate-900">مدیریت و تعدیل آگهی‌های فعال در آشیون</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="pb-3 pt-1">عنوان آگهی ملکی</th>
                <th className="pb-3 pt-1">شهر و منطقه</th>
                <th className="pb-3 pt-1">ارزش ثبتی</th>
                <th className="pb-3 pt-1">مسئول ثبت</th>
                <th className="pb-3 pt-1">عملیات ادمین</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((prop) => (
                <tr key={prop.id} className="text-slate-700">
                  <td className="py-4 font-bold max-w-xs truncate">{prop.title}</td>
                  <td className="py-4 font-semibold">{prop.city}، {prop.neighborhood}</td>
                  <td className="py-4 font-black">{(prop.price / 1000000000).toFixed(1)} میلیارد تومان</td>
                  <td className="py-4 font-semibold text-slate-500">{prop.agent.name}</td>
                  <td className="py-4">
                    <button
                      id={`delete-property-${prop.id}`}
                      onClick={() => onDeleteProperty(prop.id)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition"
                      title="حذف فوری آگهی"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
