import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';

interface CustomMarkerProps {
    isRecent?: boolean;
    hasImage?: boolean;
}

export function createCustomMarkerIcon({ isRecent = false, hasImage = false }: CustomMarkerProps = {}) {
    const size = isRecent ? 48 : 36;
    const markerSvg = renderToStaticMarkup(
        <svg
            width={size}
            height={size * 1.4}
            viewBox="0 0 36 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isRecent ? 'animate-bounce-subtle' : ''}
        >
            <defs>
                <linearGradient id={`gradient-${isRecent ? 'recent' : 'normal'}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isRecent ? "#ec4899" : "#3b82f6"} />
                    <stop offset="100%" stopColor={isRecent ? "#f97316" : "#8b5cf6"} />
                </linearGradient>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Pin shape */}
            <path
                d="M18 2C10.268 2 4 8.268 4 16c0 9 14 30 14 30s14-21 14-30c0-7.732-6.268-14-14-14z"
                fill={`url(#gradient-${isRecent ? 'recent' : 'normal'})`}
                filter="url(#shadow)"
                stroke="white"
                strokeWidth="2"
            />

            {/* Inner circle */}
            <circle
                cx="18"
                cy="16"
                r="6"
                fill="white"
                opacity="0.9"
            />

            {/* Image indicator */}
            {hasImage && (
                <circle
                    cx="18"
                    cy="16"
                    r="3"
                    fill={isRecent ? "#ec4899" : "#3b82f6"}
                />
            )}
        </svg>
    );

    return L.divIcon({
        html: markerSvg,
        className: 'custom-marker',
        iconSize: [size, size * 1.4],
        iconAnchor: [size / 2, size * 1.4],
        popupAnchor: [0, -size * 1.4],
    });
}
