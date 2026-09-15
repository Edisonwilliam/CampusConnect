import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const stripeKey =
      this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }

    this.stripe = new Stripe(stripeKey);
  }

  async createCheckoutSession(
    items: any[],
    userId: number,
  ): Promise<Stripe.Checkout.Session> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL');

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'ngn',
        product_data: {
          name: item.title,
          description: `${item.category} • ${item.condition}`,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity || 1,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cart`,
      metadata: {
        userId: userId.toString(),
      },
    });

    return session;
  }

  async getCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }
}