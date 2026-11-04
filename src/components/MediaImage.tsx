import type { FC, SyntheticEvent } from "react";
import { Image } from "react-bootstrap";
import { DEFAULT_IMAGE_URL } from "../constants";
import { resolveImageUrl } from "../utils/media";

interface Props {
    src: string;
    alt: string;
    className?: string;
}

export const MediaImage: FC<Props> = ({ src, alt, className }) => {
    const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
        const image = event.currentTarget;
        if (!image.src.endsWith(DEFAULT_IMAGE_URL)) {
            image.src = DEFAULT_IMAGE_URL;
        }
    };

    return <Image className={className} src={resolveImageUrl(src)} alt={alt} onError={handleError} />;
};
