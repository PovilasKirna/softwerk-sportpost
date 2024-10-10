import Typography from '@/components/ui/typography';
import { ImageGenerator } from './image-generator';

export default function ImagePage() {
    return (
        <div className="flex flex-col gap-2">
            <Typography variant="h1">Your post</Typography>
            <ImageGenerator />
        </div>
    );
}
