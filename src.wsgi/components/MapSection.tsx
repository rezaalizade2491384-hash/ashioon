/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property } from '../types';
import { Map, MapPin, Compass, Navigation, Radio, Layers, Landmark, Shield, GraduationCap, MapIcon } from 'lucide-react';

interface MapSectionProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onFilterByBounds?: (bounds: any) => void;
}

export default function MapSection({ properties, selectedProperty, onSelectProperty }: MapSectionProps) {
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'heatmap'>('standard');
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [drawPoints, setDrawPoints] = useState<{ x: number; y: number }[]>([]);
  const [radiusSearch, setRadiusSearch] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<boolean>(false);

  // Simulated nearby attractions for selected property
  const getNearbyAttractions = (property: Property) => {
    return [
      { name: 'ایستگاه مترو پاسداران/نیاوران', distance: '۴۵۰ متر', type: 'metro', icon: Navigation },
      { name: 'مرکز خرید تندیس / روشا', distance: '۱.۲ کیلومتر', type: 'mall', icon: Landmark },
      { name: 'بیمارستان تخصصی پارسا', distance: '۸۰۰ متر', type: 'hospital', icon: Shield },
      { name: 'مدرسه هوشمند فرزانگان', distance: '۶۰۰ متر', type: 'school', icon: GraduationCap }
    ];
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drawMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDrawPoints((prev) => [...prev, { x, y }]);
    }
  };

  const clearDrawing = () => {
    setDrawPoints([]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[520px] relative">
      {/* Map Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2 justify-between pointer-events-none">
        {/* Left Side Controls */}
        <div className="flex gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/50 shadow-lg pointer-events-auto">
          <button
            id="map-type-standard"
            onClick={() => setMapType('standard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              mapType === 'standard' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            نقشه استاندارد
          </button>
          <button
            id="map-type-satellite"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              mapType === 'satellite' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            ماهواره‌ای
          </button>
          <button
            id="map-type-heatmap"
            onClick={() => setMapType('heatmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              mapType === 'heatmap' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            نقشه حرارتی املاک
          </button>
        </div>

        {/* Right Side Tools */}
        <div className="flex gap-1.5 pointer-events-auto">
          <button
            id="btn-radius-search"
            onClick={() => {
              setRadiusSearch(!radiusSearch);
              setDrawMode(false);
              clearDrawing();
            }}
            className={`p-2.5 rounded-2xl shadow-lg border backdrop-blur-md transition flex items-center justify-center ${
              radiusSearch
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="جستجو در شعاع ۱ کیلومتری"
          >
            <Radio className="w-4 h-4" />
          </button>
          <button
            id="btn-draw-area"
            onClick={() => {
              setDrawMode(!drawMode);
              setRadiusSearch(false);
              clearDrawing();
            }}
            className={`p-2.5 rounded-2xl shadow-lg border backdrop-blur-md transition flex items-center justify-center ${
              drawMode
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="رسم محدوده سفارشی روی نقشه"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            id="btn-current-location"
            onClick={() => setCurrentLocation(!currentLocation)}
            className={`p-2.5 rounded-2xl shadow-lg border backdrop-blur-md transition flex items-center justify-center ${
              currentLocation
                ? 'bg-indigo-600 border-indigo-700 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="موقعیت فعلی من"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Rendering Container */}
      <div
        id="leaflet-simulated-canvas"
        onClick={handleMapClick}
        className={`flex-1 relative overflow-hidden cursor-crosshair transition-all duration-500 ${
          mapType === 'satellite' ? 'bg-[#0f172a]' : 'bg-[#e2e8f0]'
        }`}
      >
        {/* Standard Map Vector Simulation */}
        {mapType === 'standard' && (
          <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        )}

        {/* Heatmap overlay option */}
        {mapType === 'heatmap' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-amber-500/20 to-emerald-500/10 mix-blend-overlay animate-pulse"></div>
        )}

        {/* Simulated Streets for high realism */}
        <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
          <div className="h-[2px] bg-white w-full rotate-12 mt-16"></div>
          <div className="h-[2px] bg-white w-full -rotate-6 mb-24"></div>
          <div className="w-[2px] bg-white h-full left-1/3 absolute"></div>
          <div className="w-[2px] bg-white h-full left-2/3 absolute"></div>
        </div>

        {/* Draw Area Polygon visualizer */}
        {drawPoints.length > 0 && (
          <svg className="absolute inset-0 pointer-events-none w-full h-full">
            <polygon
              points={drawPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="rgba(16, 185, 129, 0.15)"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {drawPoints.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="#10b981" stroke="white" strokeWidth="1.5" />
            ))}
          </svg>
        )}

        {/* Draw Instructions Overlay */}
        {drawMode && (
          <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white px-3 py-2 rounded-xl text-[11px] font-bold shadow-lg flex items-center gap-2 border border-slate-700/50 pointer-events-auto">
            <span>چند نقطه روی نقشه بزنید تا محدوده رسم شود</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearDrawing();
              }}
              className="bg-rose-500 hover:bg-rose-600 px-2 py-1 rounded-lg text-white"
            >
              حذف رسم
            </button>
          </div>
        )}

        {/* Simulated Radius concentric circles */}
        {radiusSearch && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-72 h-72 rounded-full border-2 border-emerald-500/40 bg-emerald-500/5 animate-pulse flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-emerald-500/30 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-emerald-500/20"></div>
              </div>
            </div>
          </div>
        )}

        {/* User Current Location Pin */}
        {currentLocation && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto animate-bounce">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-indigo-500 opacity-30 animate-ping"></span>
              <div className="bg-indigo-600 text-white p-2.5 rounded-full shadow-2xl border-2 border-white">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
            </div>
          </div>
        )}

        {/* Property Pins */}
        {properties.map((prop, idx) => {
          // Compute pseudo coordinate translation on visual canvas
          const xPercent = 15 + ((prop.lng % 0.2) * 500) % 70;
          const yPercent = 20 + ((prop.lat % 0.2) * 500) % 65;

          const isSelected = selectedProperty?.id === prop.id;

          return (
            <button
              key={prop.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectProperty(prop);
              }}
              style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 group ${
                isSelected ? 'scale-110 z-20' : 'hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`px-3 py-1.5 rounded-xl shadow-lg border font-bold text-xs flex items-center gap-1.5 transition-all duration-300 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-800 border-slate-200 group-hover:bg-slate-50'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-rose-500'}`} />
                  <span>
                    {(prop.price / 1000000000).toFixed(1)} میلیارد
                  </span>
                </div>
                <div className={`w-2.5 h-2.5 rotate-45 -mt-1.5 border-b border-r transition ${
                  isSelected ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Property Metadata Panel / Nearby Information */}
      {selectedProperty && (
        <div className="bg-slate-900 text-white p-5 border-t border-slate-800 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.title}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
            />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10">
                {selectedProperty.type === 'apartment' ? 'آپارتمان' : selectedProperty.type === 'villa' ? 'ویلا' : selectedProperty.type === 'commercial' ? 'اداری تجاری' : 'زمین'}
              </span>
              <h4 className="font-bold text-sm mt-1 line-clamp-1">{selectedProperty.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{selectedProperty.neighborhood}، {selectedProperty.city}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400">مراکز مهم و نزدیک به ملک:</span>
            <div className="grid grid-cols-2 gap-3">
              {getNearbyAttractions(selectedProperty).map((att, i) => {
                const Icon = att.icon;
                return (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{att.name}</span>
                    <span className="text-[10px] text-slate-400">({att.distance})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
