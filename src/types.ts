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

// ===== LIBRARY TYPE RE-EXPORTS =====
export type { ComponentProps, ReactNode, MouseEvent, ChangeEvent } from 'react';
export type {
  Middleware,
  PayloadAction,
  UnknownAction,
} from '@reduxjs/toolkit';
