import { z } from 'zod';

export const emailSchema = z.string().email('请输入有效的邮箱地址');

export const passwordSchema = z
  .string()
  .min(6, '密码至少需要6个字符')
  .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '密码必须包含字母和数字');

export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const validatePassword = (password: string): boolean => {
  try {
    passwordSchema.parse(password);
    return true;
  } catch {
    return false;
  }
};

export const getPasswordError = (password: string): string | null => {
  try {
    passwordSchema.parse(password);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return '密码格式不正确';
  }
};

export const getEmailError = (email: string): string | null => {
  try {
    emailSchema.parse(email);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return '邮箱格式不正确';
  }
};

