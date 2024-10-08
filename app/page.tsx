import { buttonVariants } from '@/components/ui/button';
import { ArrowUpDown, DownloadCloud, Timer } from 'lucide-react';
import Link from 'next/link';
import Typography from '@/components/ui/typography';

export default function Home() {
    return (
        <div className="flex h-full w-full flex-col gap-12 px-8 pb-24 pt-11 text-center md:px-32 md:py-36">
            <div className="flex flex-col items-center gap-6">
                <Typography className="max-w-sm md:max-w-md xl:max-w-2xl" variant="h1">
                    The easiest way to share sports highlights
                </Typography>
                <Typography className="max-w-sm md:max-w-md xl:max-w-2xl" variant="h5">
                    SportPost is the easiest way to share sports highlights with your community.
                </Typography>
                <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
                    Get Started
                </Link>
                <img className="h-auto w-full" alt="Pandem.dev hero image" src="/hero1.webp" />
            </div>
            <div className="flex flex-col items-center gap-24 md:gap-36 md:pt-24">
                <div className="flex flex-col items-center gap-12">
                    <Typography className="max-w-sm md:max-w-md xl:max-w-2xl" variant="h1">
                        Quick and easy
                    </Typography>
                    <div className="flex flex-col gap-12 md:flex-row" id="features">
                        <Feature
                            icon={<Timer size={24} />}
                            headline="Create a post"
                            description="Save 20-30 minutes of editing and uploading"
                        />
                        <Feature
                            icon={<ArrowUpDown size={24} />}
                            headline="Universally compatible"
                            description="Works with all major social media platforms"
                        />
                        <Feature
                            icon={<DownloadCloud size={24} />}
                            headline="High quality"
                            description="Share your highlights with your community in seconds with the highest quality."
                        />
                    </div>
                </div>
                <div className="flex max-w-sm flex-col items-center gap-6 md:max-w-md xl:max-w-2xl">
                    <Typography className="max-w-sm md:max-w-md xl:max-w-2xl" variant="h1">
                        Instant templates, no more headaches
                    </Typography>
                    <Typography className="max-w-sm md:max-w-md xl:max-w-2xl" variant="p">
                        SportPost has a variety of templates to get you started.
                    </Typography>
                    <img alt="Pandem.dev hero image" src="/hero2.webp" className="h-auto w-full" />
                </div>
            </div>
        </div>
    );
}

interface FeatureProps {
    icon: React.ReactNode;
    headline: string;
    description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, headline, description }) => {
    return (
        <div className="flex max-w-72 flex-col items-center gap-6 text-left md:items-start">
            <div className="max-w-fit rounded-md border px-4 py-4">{icon}</div>
            <Typography variant="h3">{headline}</Typography>
            <Typography variant="p" className="text-minor">
                {description}
            </Typography>
        </div>
    );
};
