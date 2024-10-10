'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';

const FormSchema = z.object({
    time: z
        .string()
        .min(1, {
            message: 'Time is required.',
        })
        .regex(/^[0-9]{2}:[0-9]{2}$/, {
            message: 'Invalid time format. Please use the format HH:MM.',
        }),
});

export function TimeInput() {
    const [time, setTime] = useQueryState('time');
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            time: '',
        },
    });

    useEffect(() => {
        if (time) {
            form.setValue('time', time);
        }
    }, [time]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setTime(data.time);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                                <Input placeholder="HH:MM" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
