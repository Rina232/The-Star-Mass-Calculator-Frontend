import { useEffect, useState, type ChangeEvent, type FC } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MediaImage } from "../components/MediaImage";
import {
    clearDraftError,
    createDraftStarClass,
    getDraftStarClass,
    publishDraftStarClass,
} from "../slices/draftSlice";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const parseNumber = (value: string): number => Number(value.trim().replace(",", "."));

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

    useEffect(() => {
        document.title = "Добавление спектрального класса";
        dispatch(clearDraftError());
        dispatch(getDraftStarClass());
    }, [dispatch]);

    useEffect(() => {
        if (draft) {
            setTitle(draft.title);
            setDescription(draft.description ?? "");
            setMass(draft.mass !== null ? String(draft.mass) : "");
            setLuminosity(draft.luminosity !== null ? String(draft.luminosity) : "");
        }
    }, [draft]);

    const handleFile = (setter: (file: File | null) => void) => (event: ChangeEvent<HTMLInputElement>) => {
        setter(event.target.files?.[0] ?? null);
    };

    const handleNext = () => {
        dispatch(
            createDraftStarClass({
                title: title.trim(),
                image: image ?? undefined,
                video: video ?? undefined,
            }),
        );
    };

    const handlePublish = async () => {
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

    const canCreate = !draft && title.trim().length >= 3;
    const canPublish =
        !!draft &&
        description.trim().length >= 3 &&
        mass.trim() !== "" &&
        luminosity.trim() !== "" &&
        Number.isFinite(parseNumber(mass)) &&
        Number.isFinite(parseNumber(luminosity));

    return (
        <section className="form-screen">
            <h1 className="form-title">Новый спектральный класс</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="form-body">
                <h2 className="form-section">Медиа</h2>

                <Form.Group controlId="title" className="form-group-dark">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                        placeholder="Спектральный класс X"
                        disabled={!!draft}
                    />
                </Form.Group>

                {draft ? (
                    <div className="draft-preview">
                        <MediaImage className="draft-preview-img" src={draft.imageUrl} alt={draft.title} />
                        <p className="draft-note">Черновик создан. Заполните информацию ниже и опубликуйте.</p>
                    </div>
                ) : (
                    <>
                        <Form.Group controlId="image" className="form-group-dark">
                            <Form.Label>Изображение</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleFile(setImage)} />
                        </Form.Group>
                        <Form.Group controlId="video" className="form-group-dark">
                            <Form.Label>Короткое видео</Form.Label>
                            <Form.Control type="file" accept="video/*" onChange={handleFile(setVideo)} />
                        </Form.Group>
                        <Button className="btn-gold form-submit" disabled={!canCreate} onClick={handleNext}>
                            Далее
                        </Button>
                    </>
                )}

                {draft && (
                    <>
                        <h2 className="form-section">Информация</h2>

                        <Form.Group controlId="description" className="form-group-dark">
                            <Form.Label>Краткое описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                maxLength={500}
                                value={description}
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="mass" className="form-group-dark">
                            <Form.Label>Масса, M⨀</Form.Label>
                            <Form.Control
                                type="text"
                                inputMode="decimal"
                                value={mass}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setMass(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="luminosity" className="form-group-dark">
                            <Form.Label>Светимость, L⨀</Form.Label>
                            <Form.Control
                                type="text"
                                inputMode="decimal"
                                value={luminosity}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setLuminosity(event.target.value)}
                            />
                        </Form.Group>
                        <Button className="btn-gold form-submit" disabled={!canPublish} onClick={handlePublish}>
                            Опубликовать
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
};
