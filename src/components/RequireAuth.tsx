import type { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../Routes";
import { useAppSelector } from "../store/hooks";

export const RequireAuth: FC = () => {
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

    return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};
