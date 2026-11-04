import { useEffect, useMemo, useState, type FC, type SyntheticEvent } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HeartIcon } from "../components/HeartIcon";
import { MediaImage } from "../components/MediaImage";
import { DEFAULT_VIDEO_URL } from "../constants";
import {
    getFirstPublishedStarClass,
    getNextPublishedStarClass,
    getPublishedStarClassById,
} from "../modules/starClassesMock";
import { ROUTES } from "../Routes";
import { formatAstroNumber } from "../utils/formatAstroNumber";
import { resolveImageUrl, resolveVideoUrl } from "../utils/media";

export const FeedPage: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const starClass = useMemo(
        () => (id ? getPublishedStarClassById(Number(id)) : getFirstPublishedStarClass()),
        [id],
    );

    useEffect(() => {
        setExpanded(false);
        document.title = starClass ? `Лента - ${starClass.title}` : "Лента";
    }, [starClass]);

    const handleNext = () => {
        if (!starClass) {
            return;
        }
        const next = getNextPublishedStarClass(starClass.id);
        if (next) {
            navigate(`${ROUTES.FEED}/${next.id}`);
        }
    };

    const handleVideoError = (event: SyntheticEvent<HTMLVideoElement>) => {
        const video = event.currentTarget;
        if (!video.src.endsWith(DEFAULT_VIDEO_URL)) {
            video.src = DEFAULT_VIDEO_URL;
            video.load();
            video.play().catch(() => undefined);
        }
    };

    if (!starClass) {
        return (
            <section className="empty-screen">
                <p>Услуга не найдена.</p>
                <Button as={Link as never} to={ROUTES.CATALOG} className="btn-gold">
                    В каталог
                </Button>
            </section>
        );
    }

    const imageUrl = resolveImageUrl(starClass.imageUrl);
    const videoUrl = resolveVideoUrl(starClass.videoUrl);

    return (
        <section className="feed-screen">
            <video
                key={`video-${starClass.id}`}
                className="feed-video"
                src={videoUrl}
                poster={imageUrl}
                autoPlay
                loop
                muted
                playsInline
                onError={handleVideoError}
            />

            <MediaImage key={`poster-${starClass.id}`} className="feed-poster" src={starClass.imageUrl} alt={starClass.title} />

            <div className="feed-overlay-actions">
                <div className="like-badge">
                    <HeartIcon />
                </div>
                <span className="icon-desc">{starClass.likeCount}</span>

                <div className="icon-badge">M⨀</div>
                <span className="icon-desc">{formatAstroNumber(starClass.mass)}</span>

                <div className="icon-badge">L⨀</div>
                <span className="icon-desc">{formatAstroNumber(starClass.luminosity)}</span>

                <Button className="btn-icon" aria-label="Следующий" onClick={handleNext}>
                    <svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                        <path
                            d="M24 10V38M10 24L24 38L38 24"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Button>
            </div>

            <div className="feed-bottom-gradient">
                <h1 className="feed-title">{starClass.title}</h1>
                <p className={expanded ? "feed-desc feed-desc-open" : "feed-desc"}>{starClass.description}</p>
                <Button variant="link" className="desc-toggle" onClick={() => setExpanded((value) => !value)}>
                    {expanded ? "свернуть" : "ещё…"}
                </Button>
            </div>
        </section>
    );
};
