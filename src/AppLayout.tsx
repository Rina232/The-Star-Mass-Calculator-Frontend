import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { BottomNavbar } from "./components/BottomNavbar";

export const AppLayout: FC = () => (
    <div className="app-frame">
        <main className="screen-content">
            <Outlet />
        </main>
        <BottomNavbar />
    </div>
);
