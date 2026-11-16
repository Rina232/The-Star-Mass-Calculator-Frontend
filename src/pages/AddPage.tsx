import { useEffect, useMemo, useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEFAULT_IMAGE_URL, DEFAULT_VIDEO_URL } from "../constants";
import {
    clearDraftError,
    createDraftStarClass,
    getDraftStarClass,
    publishDraftStarClass,
} from "../slices/draftSlice";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resolveImageUrl, resolveVideoUrl } from "../utils/media";

const parseNumber = (value: string): number => Number(value.trim().replace(/\s/g, "").replace(",", "."));

const PlusIcon: FC = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
            d="M1 9.52662H18.9508M9.97538 1V18.0532"
            stroke="#8CB4FF"
            strokeOpacity="0.85"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

const useFilePreview = (file: File | null): string | null => {
    const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
    useEffect(() => {
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [url]);
    return url;
};

export const AddPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { draft, error } = useAppSelector((state) => state.draft);

    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [mass, setMass] = useState("");
    const [luminosity, setLuminosity] = useState("");

    const imagePreview = useFilePreview(image);
    const videoPreview = useFilePreview(video);

    useEffect(() => {
        document.title = "Создание черновика класса";
        dispatch(clearDraftError());
        dispatch(getDraftStarClass());
    }, [dispatch]);

    useEffect(() => {
        document.title = draft ? "Публикация класса" : "Создание черновика класса";
    }, [draft]);

    const handleFile = (setter: (file: File | null) => void) => (event: ChangeEvent<HTMLInputElement>) => {
        setter(event.target.files?.[0] ?? null);
    };

    const handleCreate = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(
            createDraftStarClass({
                title: title.trim(),
                image: image ?? undefined,
                video: video ?? undefined,
            }),
        );
    };

    const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const published = await dispatch(
                publishDraftStarClass({
                    description: description.trim(),
                    mass: parseNumber(mass),
                    luminosity: parseNumber(luminosity),
                }),
            ).unwrap();
            navigate(`${ROUTES.FEED}/${published.id}`);
        } catch {
            return;
        }
    };

    const previewImage = imagePreview ?? (draft ? resolveImageUrl(draft.imageUrl) : DEFAULT_IMAGE_URL);
    const previewVideo = videoPreview ?? (draft ? resolveVideoUrl(draft.videoUrl) : DEFAULT_VIDEO_URL);

    const mediaField = (
        <div className="field media-field">
            <label>Медиа</label>

            <div className="media-item">
                <img className="media-preview-img" src={previewImage} alt="" />
                <input
                    type="file"
                    id="photoInput"
                    name="photo"
                    accept="image/*"
                    className="media-file-input"
                    onChange={handleFile(setImage)}
                />
                <label htmlFor="photoInput" className="media-btn">
                    Фото
                    <PlusIcon />
                </label>
            </div>

            <div className="media-item">
                <video
                    key={previewVideo}
                    className="media-preview-video"
                    src={previewVideo}
                    muted
                    loop
                    autoPlay
                    playsInline
                />
                <input
                    type="file"
                    id="videoInput"
                    name="video"
                    accept="video/*"
                    className="media-file-input"
                    onChange={handleFile(setVideo)}
                />
                <label htmlFor="videoInput" className="media-btn">
                    Видео
                    <PlusIcon />
                </label>
            </div>
        </div>
    );

    return (
        <section className="form-screen">
            <div className="form-panel">
                {error && (
                    <Alert variant="danger" className="form-alert">
                        {error}
                    </Alert>
                )}

                {!draft ? (
                    <>
                        <h1 className="form-title">
                            Создание черновика
                            <br />
                            класса
                        </h1>

                        <form onSubmit={handleCreate}>
                            {mediaField}

                            <div className="field">
                                <label htmlFor="name">Название</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="title"
                                    placeholder="Спектральный класс O"
                                    value={title}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                                    required
                                />
                            </div>

                            <button className="save-btn" type="submit">
                                Далее
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="form-title">
                            Публикация
                            <br />
                            класса
                        </h1>

                        <form onSubmit={handlePublish}>
                            {mediaField}

                            <div className="field">
                                <label htmlFor="name">Название</label>
                                <input type="text" id="name" value={draft.title} readOnly />
                            </div>

                            <div className="field">
                                <label htmlFor="desc">Краткое описание</label>
                                <textarea
                                    id="desc"
                                    name="description"
                                    placeholder="Спектральный класс O - самые горячие, массивные и яркие звёзды."
                                    value={description}
                                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="mass">Средняя масса (M⨀)</label>
                                <input
                                    type="text"
                                    id="mass"
                                    name="mass"
                                    placeholder="25"
                                    value={mass}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => setMass(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="luminosity">Средняя светимость (L⨀)</label>
                                <input
                                    type="text"
                                    id="luminosity"
                                    name="luminosity"
                                    placeholder="80 000"
                                    value={luminosity}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => setLuminosity(event.target.value)}
                                    required
                                />
                            </div>

                            <button className="save-btn" type="submit">
                                Опубликовать
                            </button>
                        </form>
                    </>
                )}
            </div>
        </section>
    );
};
