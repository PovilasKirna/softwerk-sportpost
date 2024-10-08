'use server';

import { Database } from '@/lib/types/database.types';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function getUserAccount(supabase: SupabaseClient<Database>) {
    try {
        const session = await supabase.auth.getUser();
        if (!session.data.user) {
            throw new Error('No session data found');
        }

        const { data: user, error: user_error } = await supabase
            .from('accounts')
            .select('*')
            .eq('id', session.data.user.id)
            .single();

        if (user_error) {
            throw new Error(JSON.stringify(user_error));
        }

        if (!user) {
            throw new Error('User not found');
        }
        return { data: user, error: null };
    } catch (error) {
        console.error('Error fetching user:', error);
        return {
            data: null,
            error: 'Error fetching user',
        };
    }
}

type Price = {
    price_id: string;
    active: boolean | null;
    currency: string | null;
    unit_amount: number | null;
    created: string | null; // Assuming timestamps are returned as ISO strings
    attrs: Record<string, any> | null;
    type: string | null;
    recurring_interval: string | null;
    recurring_interval_count: number | null;
};

export type Product = {
    product_id: string;
    name: string | null;
    active: boolean | null;
    description: string | null;
    created: string | null; // Assuming timestamps are returned as ISO strings
    updated: string | null; // Assuming timestamps are returned as ISO strings
    attrs: Record<string, any> | null;
    prices: Price[] | null;
};

type GetProductsWithPricesResponse = Product[];

export async function getPlansPrices(
    supabase: SupabaseClient<Database>,
): Promise<{ data: GetProductsWithPricesResponse | null; error: string | null }> {
    try {
        const { data, error } = await supabase.rpc('get_products_with_prices');
        if (error) {
            throw new Error(JSON.stringify(error));
        }
        return { data: data as GetProductsWithPricesResponse, error: null };
    } catch (error) {
        console.error('Error fetching plans:', error);
        return {
            data: null,
            error: 'Error fetching plans',
        };
    }
}

export async function upsertCustomer(customer_id: string) {
    try {
        const supabase = await supabaseAdmin();

        const { data, error } = await supabase.from('accounts').select('*').eq('id', customer_id).single();

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        const customer = {
            customer_id: customer_id,
            email: data.email,
            name: data.name || data.email,
            created: new Date().toISOString(),
        };

        const { error: customerError } = await supabase.from('customers').upsert(customer);

        if (customerError) {
            throw new Error(JSON.stringify(error));
        }

        return {
            data: {
                customer_id: customer.customer_id,
                email: customer.email,
                name: customer.name,
            },
            error: null,
        };
    } catch (error) {
        console.error('Error upserting customer:', error);
        return {
            data: null,
            error: 'Error upserting customer',
        };
    }
}

export async function upsertPrice(price: Stripe.Price, supabase: SupabaseClient<Database>) {
    try {
        const { error } = await supabase.from('prices').upsert({
            price_id: price.id,
            active: price.active,
            currency: price.currency,
            unit_amount: price.unit_amount,
            product_id: price.product as string,
            created: new Date().toISOString(),
            type: price.type,
            recurring_interval: price.recurring?.interval || null,
            recurring_interval_count: price.recurring?.interval_count || null,
        });

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return { data: price.id, error: null };
    } catch (error) {
        console.error('Error upserting price:', error);
        return {
            data: null,
            error: 'Error upserting price',
        };
    }
}

export async function deletePrice(price: Stripe.Price, supabase: SupabaseClient<Database>) {
    try {
        const { error } = await supabase.from('prices').delete().eq('price_id', price.id);

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return { data: price.id, error: null };
    } catch (error) {
        console.error('Error deleting price:', error);
        return {
            data: null,
            error: 'Error deleting price',
        };
    }
}

export async function upsertProduct(product: Stripe.Product, supabase: SupabaseClient<Database>) {
    try {
        const { data } = await supabase.from('products').select().eq('product_id', product.id);

        const { error } = await supabase.from('products').upsert({
            product_id: product.id,
            active: product.active,
            name: product.name,
            description: product.description,
            created: data?.length ? data[0].created : new Date().toISOString(),
            updated: new Date().toISOString(),
        });

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return { data: product.id, error: null };
    } catch (error) {
        console.error('Error upserting product:', error);
        return {
            data: null,
            error: 'Error upserting product',
        };
    }
}

export async function deleteProduct(product: Stripe.Product, supabase: SupabaseClient<Database>) {
    try {
        const { error } = await supabase.from('products').delete().eq('product_id', product.id);

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        return { data: product.id, error: null };
    } catch (error) {
        console.error('Error deleting product:', error);
        return {
            data: null,
            error: 'Error deleting product',
        };
    }
}

export async function manageSubscriptionStatusChange(
    subscription: Stripe.Subscription,
    supabase: SupabaseClient<Database>,
    customer_id: string,
) {
    try {
        const { error } = await supabase.from('subscriptions').upsert({
            subscription_id: subscription.id,
            customer_id: customer_id as string,
            status: subscription.status,
            created: new Date().toISOString(),
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at).toISOString() : null,
            cancel_at_period_end: subscription.cancel_at_period_end,
            currency: subscription.currency,
            current_period_end: new Date(subscription.current_period_end).toISOString(),
            current_period_start: new Date(subscription.current_period_start).toISOString(),
            plan_amount: subscription.items.data[0].price.unit_amount,
            plan_interval: subscription.items.data[0].price.recurring?.interval || null,
            plan_interval_count: subscription.items.data[0].price.recurring?.interval_count || null,
            price_id: subscription.items.data[0].price.id,
            start_date: new Date(subscription.start_date).toISOString(),
        });

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        if (subscription.status === 'active') {
            const { error } = await supabase
                .from('accounts')
                .update({ subscription_id: subscription.id, has_license: true })
                .eq('id', customer_id as string);

            if (error) {
                throw new Error(JSON.stringify(error));
            }
        }

        return { data: subscription.id, error: null };
    } catch (error) {
        console.error('Error managing subscription status change:', error);
        return {
            data: null,
            error: 'Error managing subscription status change',
        };
    }
}

export async function fulfillOrder(charge: Stripe.Charge, supabase: SupabaseClient<Database>, account_id: string) {
    try {
        const { error } = await supabase.from('charges').upsert({
            charge_id: charge.id,
            amount: charge.amount,
            currency: charge.currency,
            customer_id: account_id,
            created: new Date().toISOString(),
            payment_method: charge.payment_method as string,
            status: charge.status,
            description: charge.description,
            invoice_id: charge.invoice as string,
            receipt_url: charge.receipt_url,
        });

        if (error) {
            throw new Error(JSON.stringify(error));
        }

        const { error: account_error } = await supabase
            .from('accounts')
            .update({
                has_license: true,
            })
            .eq('id', account_id);

        if (account_error) {
            throw new Error(JSON.stringify(error));
        }

        return { data: charge.id, error: null };
    } catch (error) {
        console.error('Error fulfilling order:', error);
        return {
            data: null,
            error: 'Error fulfilling order',
        };
    }
}
