import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
  password: z.string().min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다' }),
});

export type LoginForm = z.infer<typeof loginSchema>;

// 회원가입 스키마
export const registerEmailSchema = z.object({
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
});

export const registerRoleSchema = z.object({
  role: z.enum(['ADMIN', 'SUPER_ADMIN'], {
    message: '역할을 선택해주세요',
  }),
});

export const registerPasswordSchema = z
  .object({
    password: z.string().min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export const registerSchema = z
  .object({
    email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
    role: z.enum(['ADMIN', 'SUPER_ADMIN']),
    password: z.string().min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export type RegisterEmailForm = z.infer<typeof registerEmailSchema>;
export type RegisterRoleForm = z.infer<typeof registerRoleSchema>;
export type RegisterPasswordForm = z.infer<typeof registerPasswordSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;

// 퍼널 상태 타입
export interface FunnelState {
  email?: string;
  role?: 'ADMIN' | 'SUPER_ADMIN';
  password?: string;
  currentStep: 'email' | 'role' | 'password';
}
