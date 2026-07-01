/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property } from '../types';
import { Heart, Maximize2, Bed, Calendar, Check, Scale, Phone, MessageCircle } from 'lucide-react';

interface PropertyCardProps {
  key?: string;
  property: Property;
  onSelect: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isComparing: boolean;
  onToggleCompare: (property: Property) => void;
}

export default function PropertyCard({
  property,
  onSelect,
  isFavorite,
  onToggleFavorite,
  isComparing,
  onToggleCompare
}: PropertyCardProps) {
  const [hovered, setHovered] = useState(false);

  const formatPrice = (price: number, rentPrice?: number) => {
    if (property.transactionType === 'rent') {
      return (
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-slate-400 font-bold">رهن و اجاره:</span>
          <span className="text-sm font-extrabold text-slate-900">
            {(price / 100000000).toFixed(1)} میلیارد رهن + {rentPrice ? (rentPrice / 1000000).toFixed(0) + ' میلیون' : ''} اجاره
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-start">
        <span className="text-[10px] text-slate-400 font-bold">قیمت کل خرید:</span>
        <span className="text-base font-extrabold text-emerald-600">
          {(price / 1000000000).toFixed(1)} میلیارد تومان
        </span>
      </div>
    );
  };

  return (
    <div
      id={`property-card-${property.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col group relative"
    >
      {/* Upper image and badge layer */}
      <div className="relative overflow-hidden aspect-[4/3] cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Favorite & Compare Action Buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <span className={`text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-md ${
            property.transactionType === 'buy'
              ? 'bg-slate-900 text-white'
              : 'bg-emerald-500 text-white'
          }`}>
            {property.transactionType === 'buy' ? 'فروشی' : 'رهن و اجاره'}
          </span>

          <div className="flex gap-2">
            {/* Compare Toggle */}
            <button
              id={`compare-toggle-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(property);
              }}
              className={`p-2 rounded-xl transition shadow-md backdrop-blur-md ${
                isComparing
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/80 hover:bg-white text-slate-700'
              }`}
              title="افزودن به مقایسه ملک"
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Favorite Toggle */}
            <button
              id={`favorite-toggle-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(property.id);
              }}
              className={`p-2 rounded-xl transition shadow-md backdrop-blur-md ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 hover:bg-white text-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Floating Tag Type */}
        <div className="absolute bottom-4 right-4">
          <span className="text-[10px] uppercase font-black tracking-wider bg-white/95 text-slate-900 px-2.5 py-1 rounded-lg shadow-sm">
            {property.type === 'apartment' ? 'آپارتمان' : property.type === 'villa' ? 'ویلا' : property.type === 'commercial' ? 'اداری' : 'زمین'}
          </span>
        </div>
      </div>

      {/* Content section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location details */}
          <p className="text-[11px] text-slate-400 font-bold mb-1">
            {property.city} • {property.neighborhood}
          </p>

          {/* Title */}
          <h3
            onClick={() => onSelect(property)}
            className="font-bold text-slate-800 text-sm tracking-tight hover:text-emerald-600 cursor-pointer line-clamp-1 transition duration-150 mb-3"
          >
            {property.title}
          </h3>

          {/* Core technical specs row */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-500 font-medium mb-4 text-center">
            <div className="flex flex-col items-center gap-1 border-l border-slate-100 last:border-0">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{property.area} متر</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-slate-100 last:border-0">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.rooms} خواب</span>
            </div>
            <div className="flex flex-col items-center gap-1 last:border-0">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{property.yearBuilt} ساخت</span>
            </div>
          </div>
        </div>

        {/* Lower section: Pricing + Agent contact details */}
        <div>
          <div className="flex items-center justify-between mb-4">
            {formatPrice(property.price, property.rentPrice)}
          </div>

          {/* Agent info */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 bg-slate-50/50 -mx-5 -mb-5 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                {property.agent.isVerified && (
                  <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center" title="آژانس تایید شده">
                    <Check className="w-2 h-2 text-white" />
                  </span>
                )}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-700">{property.agent.name}</p>
                <p className="text-[9px] text-slate-400 font-medium">{property.agent.agencyName}</p>
              </div>
            </div>

            {/* Quick action contact buttons */}
            <div className="flex gap-1.5">
              <a
                id={`agent-call-${property.id}`}
                href={`tel:${property.agent.phone}`}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 p-1.5 rounded-xl transition"
                title="تماس مستقیم"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <a
                id={`agent-whatsapp-${property.id}`}
                href={property.agent.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-1.5 rounded-xl transition"
                title="ارسال پیام روی واتس‌اپ"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
