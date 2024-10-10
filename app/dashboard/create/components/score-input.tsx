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
    score: z
        .string()
        .min(1, {
            message: 'Score is required.',
        })
        .regex(/^[0-9]{1,2}-[0-9]{1,2}$/, {
            message: 'Invalid score format. Please use the format 1-0.',
        }),
});

export function ScoreInput() {
    const [score, setScore] = useQueryState('score');
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            score: '',
        },
    });

    useEffect(() => {
        if (score) {
            form.setValue('score', score);
        }
    }, [score]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setScore(data.score);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Score</FormLabel>
                            <FormControl>
                                <Input placeholder="1-0" {...field} />
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
