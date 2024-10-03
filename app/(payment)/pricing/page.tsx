'use client';

import React, { useState } from 'react';
import { PricingCard } from './components/pricing-card';
import { PricingSwitch } from './components/pricing-switch';

const plans = [
    {
        title: 'Basic',
        monthlyPrice: 10,
        yearlyPrice: 100,
        description: 'Essential features you need to get started',
        features: ['Example Feature Number 1', 'Example Feature Number 2', 'Example Feature Number 3'],
        actionLabel: 'Get Started',
    },
    {
        title: 'Pro',
        monthlyPrice: 25,
        yearlyPrice: 250,
        description: 'Perfect for owners of small & medium businessess',
        features: ['Example Feature Number 1', 'Example Feature Number 2', 'Example Feature Number 3'],
        actionLabel: 'Get Started',
        popular: true,
    },
    // {
    //     title: 'Enterprise',
    //     price: 'Custom',
    //     description: 'Dedicated support and infrastructure to fit your needs',
    //     features: [
    //         'Example Feature Number 1',
    //         'Example Feature Number 2',
    //         'Example Feature Number 3',
    //         'Super Exclusive Feature',
    //     ],
    //     actionLabel: 'Contact Sales',
    //     exclusive: true,
    // },
];

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <section className="text-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="pt-1 text-xl">{subtitle}</p>
        <br />
    </section>
);

export default function page() {
    const [isYearly, setIsYearly] = useState(false);
    const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1);

    return (
        <div className="py-8">
            <PricingHeader title="Pricing Plans" subtitle="Choose the plan that's right for you" />
            <PricingSwitch onSwitch={togglePricingPeriod} />
            <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
                {plans.map((plan) => {
                    return <PricingCard key={plan.title} {...plan} isYearly={isYearly} />;
                })}
            </section>
        </div>
    );
}
