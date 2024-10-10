'use client';

import { Button } from '@/components/ui/button';
import { Download, Import } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';

const downloadURI = (uri: string | undefined, name: string) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const SIZE = 300;

export function ImageGenerator() {
    const [success, setSuccess] = useQueryState('success');
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const fileRef = useRef<HTMLInputElement>(null);
    const onImportImageClick = useCallback(() => {
        fileRef?.current && fileRef?.current?.click();
    }, []);

    const onImportImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('onImportImageSelect');
        const file = e.target.files?.[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            const image = new Image(SIZE, SIZE);
            image.src = imageURL;
            setImage(image);
        }
        e.target.files = null;
    }, []);

    const stageRef = useRef<any>(null);

    const onExportClick = useCallback(() => {
        const dataUri = stageRef?.current?.toDataURL({ pixelRatio: 3 });
        downloadURI(dataUri, 'image.png');
    }, []);

    useEffect(() => {
        if (success) {
            setSuccess(null);
        }
    }, []);

    return (
        <div>
            <input
                type="file"
                ref={fileRef}
                onChange={onImportImageSelect}
                style={{ display: 'none' }}
                accept="image/*"
            />
            <div className="flex w-full justify-center gap-2">
                <Button onClick={onImportImageClick} className="flex gap-2">
                    <Import size={16} /> Import image
                </Button>
                <Button onClick={onExportClick} className="flex gap-2">
                    <Download size={16} /> Export
                </Button>
            </div>
            <Stage width={SIZE} height={SIZE} className="border" ref={stageRef}>
                <Layer>{image && <KonvaImage image={image} x={0} y={0} width={SIZE} height={SIZE} />}</Layer>
                <Layer>
                    <Text text="Hello world" fontStyle="bold" fontSize={20} x={100} y={100} />
                </Layer>
            </Stage>
        </div>
    );
}
