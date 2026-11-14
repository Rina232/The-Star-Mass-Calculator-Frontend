import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";
import { setUser } from "../slices/userSlice";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getErrorMessage } from "../utils/errors";
import axios from "axios";

export const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        document.title = isRegister ? "Регистрация" : "Вход";
    }, [isRegister]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.CATALOG, { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            if (isRegister) {
                await registerUser(username, password);
            }
            const user = await loginUser(username, password);
            dispatch(setUser({ id: user.id, username: user.username }));
        } catch (requestError) {
            if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
                setError("Неверное имя пользователя или пароль");
            } else {
                setError(getErrorMessage(requestError, "Сервис недоступен"));
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="form-screen">
            <h1 className="form-title">{isRegister ? "Регистрация" : "Вход"}</h1>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="form-body">
                <Form.Group controlId="username" className="form-group-dark">
                    <Form.Label>Имя пользователя</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                        placeholder="Введите имя пользователя"
                        minLength={isRegister ? 3 : undefined}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="password" className="form-group-dark">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        placeholder="Введите пароль"
                        minLength={isRegister ? 4 : undefined}
                        required
                    />
                </Form.Group>
                <Button type="submit" className="btn-gold form-submit" disabled={submitting}>
                    {isRegister ? "Зарегистрироваться" : "Войти"}
                </Button>
            </Form>

            <Button
                variant="link"
                className="desc-toggle form-switch"
                onClick={() => {
                    setIsRegister((value) => !value);
                    setError(null);
                }}
            >
                {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
            </Button>
        </section>
    );
};
