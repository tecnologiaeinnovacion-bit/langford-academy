import { PaymentRecord } from '../types';
import { getPayments, upsertPayment } from './storage';

export const PAYMENT_TOKEN = 'LANGFORD_PSE_TOKEN';

export const createPaymentIntent = (payload: {
  userId: string;
  courseId: string;
  amount: number;
}): PaymentRecord => {
  const payment: PaymentRecord = {
    id: `PAY-${Date.now()}`,
    userId: payload.userId,
    courseId: payload.courseId,
    amount: payload.amount,
    status: 'PENDING',
    provider: 'MockPSE',
    token: PAYMENT_TOKEN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  upsertPayment(payment);
  return payment;
};

export const getPaymentById = (paymentId: string) => {
  return getPayments().find(payment => payment.id === paymentId) ?? null;
};

export const confirmPaymentWebhook = (paymentId: string, token: string) => {
  const payment = getPaymentById(paymentId);
  if (!payment) return null;
  const status = token === PAYMENT_TOKEN ? 'PAID' : 'FAILED';
  const updated = {
    ...payment,
    status,
    updatedAt: new Date().toISOString()
  } as PaymentRecord;
  upsertPayment(updated);
  return updated;
};
