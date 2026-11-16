import axios from "axios";
import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { setUser } from "../slices/userSlice";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getErrorMessage } from "../utils/errors";

export const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        document.title = "Вход";
    }, []);

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
            <div className="form-panel">
                <h1 className="form-title">Вход</h1>

                {error && (
                    <Alert variant="danger" className="form-alert">
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                            placeholder="Введите имя пользователя"
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    <button type="submit" className="save-btn" disabled={submitting}>
                        Войти
                    </button>
                </form>
            </div>
        </section>
    );
};
