'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseAsString, useQueryState } from 'nuqs';

export function PricingSwitch() {
    const [period, setPeriod] = useQueryState('interval', parseAsString.withDefault('month'));

    return (
        <Tabs defaultValue={period} onValueChange={setPeriod}>
            <TabsList className="px-2 py-6">
                <TabsTrigger value="month" className="text-base">
                    Monthly
                </TabsTrigger>
                <TabsTrigger value="year" className="text-base">
                    Yearly
                </TabsTrigger>
                <TabsTrigger value="lifetime" className="text-base">
                    Lifetime
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
