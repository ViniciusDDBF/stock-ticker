// types/index.ts - Single source of truth for all your app types
import type { store } from './store/configureStore';

// ===== REDUX TYPES =====
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// ===== SLICE TYPES =====
export interface CounterState {
  value: number;
  loading: boolean;
  error?: string;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface UserState {
  currentUser?: User;
  isAuthenticated: boolean;
  loading: boolean;
}

// ===== ENTITY TYPES =====
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'user' | 'moderator';

// ===== Button =====
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type LoaderType = 'spinner' | 'dots' | 'pulse' | 'bars';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loaderType?: LoaderType;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  selected?: boolean;
  style?: React.CSSProperties;
}

// ===== API REQUEST =====
export type AlphaVantageDaily = {
  [date: string]: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. adjusted close'?: string;
    '6. volume': string;
  };
};

// ===== PRODUCTS VARIANTS =====
export type ProductVariant = {
  created_at: string;
  current_price: number;
  file_url: string;
  height: string | null;
  id: number;
  length: string | null;
  name: string;
  original_price: number;
  product_id: number;
  sku: string;
  slug: string;
  stock: number;
  stores_id: number;
  updated_at: string;
  weight: string | null;
  width: string | null;
};

// ===== Custom Hooks =====
export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// ===== LIBRARY TYPE RE-EXPORTS =====
export type { ComponentProps, ReactNode, MouseEvent, ChangeEvent } from 'react';
export type {
  Middleware,
  PayloadAction,
  UnknownAction,
} from '@reduxjs/toolkit';
