import { PaymentRecord } from '../types';
import { confirmPaymentWebhook, createPaymentIntent } from './payments';

export interface PaymentProvider {
  name: 'MockPSE';
  createPaymentIntent: (payload: { userId: string; courseId: string; amount: number }) => PaymentRecord;
  confirmPayment: (paymentId: string, token: string) => PaymentRecord | null;
}

export const MockPSEProvider: PaymentProvider = {
  name: 'MockPSE',
  createPaymentIntent,
  confirmPayment: confirmPaymentWebhook
};
