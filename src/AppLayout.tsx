import type { FC } from "react";
import { Spinner } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { BottomNavbar } from "./components/BottomNavbar";
import { useAppSelector } from "./store/hooks";

export const AppLayout: FC = () => {
    const pendingRequests = useAppSelector((state) => state.ui.pendingRequests);

    return (
        <div className="app-frame" aria-busy={pendingRequests > 0}>
            <main className="screen-content">
                <Outlet />
            </main>
            <BottomNavbar />
            {pendingRequests > 0 && (
                <div className="loading-overlay">
                    <Spinner animation="border" role="status" />
                </div>
            )}
        </div>
    );
};
