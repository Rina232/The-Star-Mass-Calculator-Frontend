import type { FC } from "react";

interface Props {
    size?: number;
}

export const HeartIcon: FC<Props> = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
            d="M41.68 9.22a10.5 10.5 0 0 0-14.8 0L24 11.34l-2.12-2.12a10.5 10.5 0 0 0-14.8 14.8L24 42.46l17.68-17.68a10.5 10.5 0 0 0 0-14.8Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
