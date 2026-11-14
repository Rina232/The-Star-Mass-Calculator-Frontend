import type { FC } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import { HeartIcon } from "./HeartIcon";
import { MediaImage } from "./MediaImage";

interface Props {
    id: number;
    title: string;
    imageUrl: string;
    likeCount: number;
    onDelete?: () => void;
}

export const StarClassCard: FC<Props> = ({ id, title, imageUrl, likeCount, onDelete }) => {
    const feedLink = `${ROUTES.FEED}/${id}`;

    return (
        <Card className="star-card">
            <Link to={feedLink} className="card-link">
                <MediaImage className="card-thumb-img" src={imageUrl} alt={title} />
                <div className="card-like">
                    <HeartIcon size={18} />
                    <span>{likeCount}</span>
                </div>
            </Link>
            {onDelete && (
                <button type="button" className="card-delete" title="Удалить" aria-label="Удалить" onClick={onDelete}>
                    ✕
                </button>
            )}
            <Card.Body className="card-body-overlay">
                <Card.Title as="p" className="card-name">
                    {title}
                </Card.Title>
                <Button as={Link} to={feedLink} size="sm" className="btn-gold card-btn">
                    Подробнее
                </Button>
            </Card.Body>
        </Card>
    );
};
