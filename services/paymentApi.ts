import { PaymentRecord, PaymentStatus } from '../types';
import { confirmPaymentWebhook, createPaymentIntent, getPaymentById } from './payments';

export const createPaymentEndpoint = (payload: { userId: string; courseId: string; amount: number }): PaymentRecord => {
  return createPaymentIntent(payload);
};

export const getPaymentStatusEndpoint = (paymentId: string): PaymentStatus | null => {
  const payment = getPaymentById(paymentId);
  return payment?.status ?? null;
};

export const confirmPaymentWebhookEndpoint = (paymentId: string, token: string): PaymentRecord | null => {
  return confirmPaymentWebhook(paymentId, token);
};
