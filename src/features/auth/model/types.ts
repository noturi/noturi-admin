import { z } from 'zod';
import { authUserSchema } from '@/shared/lib/model/auth';

export { type AuthUser } from '@/shared/lib/model/auth';

export const loginSchema = z.object({
  email: z.string().email({ message: '이메일 형식이 맞지 않아요' }),
  password: z.string().min(6, { message: '비밀번호는 6자 이상이에요' }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: '이메일 형식이 맞지 않아요' }),
  name: z.string().min(1, { message: '이름을 입력하세요' }),
  nickname: z.string().min(1, { message: '닉네임을 입력하세요' }),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
  password: z.string().min(8, { message: '비밀번호는 8자 이상이어야 해요' }),
});

/** 운영자 등록 한 화면 폼 — 역할은 관리자(ADMIN) 고정 (최고 관리자는 화면에서 만들지 않음) */
export const operatorRegisterSchema = z
  .object({
    name: z.string().trim().min(1, { message: '이름을 입력하세요' }),
    nickname: z.string().trim().min(1, { message: '닉네임을 입력하세요' }),
    email: z.string().trim().email({ message: '이메일 형식이 맞지 않아요' }),
    password: z.string().min(8, { message: '비밀번호는 8자 이상이어야 해요' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 서로 달라요',
    path: ['confirmPassword'],
  });

export type OperatorRegisterForm = z.infer<typeof operatorRegisterSchema>;

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: authUserSchema,
});

export type RegisterForm = z.infer<typeof registerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
