/**
 * 认证状态管理 Store
 * 
 * 作用：
 * 1. 管理用户登录状态
 * 2. 处理登录、注册、登出逻辑
 * 3. 自动检查登录状态（Token 持久化）
 * 4. 提供用户信息给其他模块使用
 * 
 * 使用场景：
 * - 登录页面调用 login()
 * - 注册页面调用 register()
 * - 导航守卫检查 user 是否存在
 * - 个人中心显示用户信息
 */

import { create } from 'zustand';
import { User } from '@shared/types';
import { authService } from '@services/supabase/auth';
import { storage, STORAGE_KEYS } from '@shared/utils/storage';

interface AuthState {
  // 状态
  user: User | null;              // 当前登录用户
  isLoading: boolean;             // 加载状态
  isInitialized: boolean;         // 是否已初始化（检查过登录状态）
  
  // 操作方法
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;  // 检查登录状态（应用启动时调用）
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  // 登录
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { user } = await authService.signIn(email, password);
      
      // 保存用户信息到本地
      if (user) {
        await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }
      
      set({ user: user as User, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // 注册
  register: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { user } = await authService.signUp(email, password);
      
      // 注册成功后自动登录
      if (user) {
        await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        set({ user: user as User, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // 登出
  logout: async () => {
    try {
      await authService.signOut();
      await storage.removeItem(STORAGE_KEYS.USER_DATA);
      set({ user: null });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // 检查登录状态（应用启动时调用）
  checkAuth: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user: user as User | null, isInitialized: true });
    } catch (error) {
      console.error('Check auth error:', error);
      set({ user: null, isInitialized: true });
    }
  },

  // 更新用户资料
  updateProfile: async (data: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...data };
    await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));

