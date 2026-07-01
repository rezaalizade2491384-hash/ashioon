/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'villa' | 'commercial' | 'land';
  transactionType: 'buy' | 'rent';
  price: number; // For buy: Total price in Tomans. For rent: Mortgage/Deposit in Tomans
  rentPrice?: number; // Monthly rent for rent transaction type
  area: number; // in Square Meters
  rooms: number;
  yearBuilt: number;
  city: string;
  region: string;
  neighborhood: string;
  address: string;
  images: string[];
  video?: string;
  features: {
    parking: boolean;
    elevator: boolean;
    warehouse: boolean;
    balcony: boolean;
    pool: boolean;
    sauna: boolean;
    jacuzzi: boolean;
  };
  documentType: string; // سند ملکی، سرقفلی، قولنامه‌ای
  buildingDirection: 'north' | 'south' | 'east' | 'west' | 'double';
  status: 'active' | 'pending' | 'sold';
  lat: number;
  lng: number;
  agent: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    whatsapp: string;
    agencyName: string;
    isVerified: boolean;
  };
  createdAt: string;
}

export interface Agency {
  id: string;
  name: string;
  managerName: string;
  nationalId: string;
  licenseNumber: string;
  phone: string;
  province: string;
  city: string;
  logo: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface CRMLead {
  id: string;
  clientName: string;
  clientPhone: string;
  propertyName: string;
  propertyPrice: string;
  status: 'lead' | 'visit' | 'negotiation' | 'contract' | 'closed';
  date: string;
  notes: string;
}

export interface Message {
  id: string;
  senderName: string;
  senderPhone: string;
  content: string;
  propertyTitle?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  description: string;
  status: 'paid' | 'unpaid';
  date: string;
  type: 'subscription' | 'ad_boost' | 'wallet_charge';
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning';
  date: string;
  isRead: boolean;
}

export interface SearchFilters {
  city?: string;
  region?: string;
  neighborhood?: string;
  type?: string;
  transactionType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minRooms?: number;
  yearBuilt?: number;
  parking?: boolean;
  elevator?: boolean;
  warehouse?: boolean;
  balcony?: boolean;
  pool?: boolean;
  sauna?: boolean;
  jacuzzi?: boolean;
  documentType?: string;
  buildingDirection?: string;
}
