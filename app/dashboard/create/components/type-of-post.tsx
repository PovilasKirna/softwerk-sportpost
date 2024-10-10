'use client';

import { buttonVariants } from '@/components/ui/button';
import Typography from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { ClipboardList, FlagTriangleRight, HandCoins, Lock, PauseCircle, Shirt, Timer } from 'lucide-react';
import Link from 'next/link';
import { useQueryState } from 'nuqs';

type TypeOfPost = {
    name: string;
    icon: React.ReactNode;
    plan: string;
};

const types: TypeOfPost[] = [
    {
        name: 'MATCHDAY',
        icon: <FlagTriangleRight size={40} />,
        plan: 'FREE',
    },
    {
        name: 'RUSTSTAND',
        icon: <PauseCircle size={40} />,
        plan: 'FREE',
    },
    {
        name: 'EINDSTAND',
        icon: <Timer size={40} />,
        plan: 'FREE',
    },
    {
        name: 'OPSTELLING',
        icon: <ClipboardList size={40} />,
        plan: 'PREMIUM',
    },
    {
        name: 'SPONSOR',
        icon: <HandCoins size={40} />,
        plan: 'PRO',
    },
    {
        name: 'MOTM',
        icon: <Shirt size={40} />,
        plan: 'PRO',
    },
];

export function TypeOfPost() {
    const [club] = useQueryState('club');
    const [where] = useQueryState('where');
    const plan = 'FREE';

    return (
        <div className="flex flex-row flex-wrap justify-center gap-2">
            {types.map((type) => (
                <Link
                    key={type.name}
                    className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'relative h-fit w-[100px]',
                        type.plan !== plan && 'cursor-not-allowed opacity-50',
                    )}
                    href={`/dashboard/create?club=${club}&where=${where}&type=${type.name}`}
                >
                    <div className="flex h-full w-full flex-col items-center gap-2">
                        {type.icon}
                        <Typography variant="p">{type.name}</Typography>
                    </div>
                    {type.plan !== plan && <Lock className="absolute right-0 top-0" size={12} />}
                </Link>
            ))}
        </div>
    );
}
