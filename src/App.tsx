import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { RequireAuth } from "./components/RequireAuth";
import { AddPage } from "./pages/AddPage";
import { CatalogPage } from "./pages/CatalogPage";
import { FeedPage } from "./pages/FeedPage";
import { LoginPage } from "./pages/LoginPage";
import { ROUTES } from "./Routes";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route index element={<Navigate to={ROUTES.FEED} replace />} />
                    <Route path={ROUTES.FEED} element={<FeedPage />} />
                    <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
                    <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route element={<RequireAuth />}>
                        <Route path={ROUTES.ADD} element={<AddPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
