import type { FC } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ROUTES, ROUTE_LABELS, type RouteKey } from "../Routes";

interface NavItem {
    key: RouteKey;
    enabled: boolean;
    viewBox: string;
    path: string;
    strokeWidth: number;
}

const NAV_ITEMS: NavItem[] = [
    {
        key: "FEED",
        enabled: true,
        viewBox: "0 0 39 44",
        strokeWidth: 2,
        path: "M1.61627 3.28781C1.21234 3.9858 0.999761 4.77799 1 5.58439V37.6656C0.999761 38.472 1.21234 39.2642 1.61627 39.9622C2.0202 40.6602 2.60118 41.2393 3.30054 41.6409C3.99991 42.0426 4.79291 42.2527 5.59946 42.25C6.40601 42.2472 7.19756 42.0318 7.89418 41.6254L35.3976 25.5847C36.0908 25.181 36.6659 24.6024 37.0653 23.9067C37.4648 23.2111 37.6747 22.4229 37.674 21.6207C37.6733 20.8186 37.4621 20.0307 37.0614 19.3358C36.6607 18.6409 36.0846 18.0632 35.3907 17.6607L7.89418 1.62465C7.19756 1.21822 6.40601 1.00276 5.59946 1.00003C4.79291 0.997289 3.99991 1.20737 3.30054 1.60906C2.60118 2.01075 2.0202 2.58982 1.61627 3.28781Z",
    },
    {
        key: "ADD",
        enabled: false,
        viewBox: "0 0 37 37",
        strokeWidth: 2,
        path: "M1 18.502H36.004M18.502 1V36.004",
    },
    {
        key: "CATALOG",
        enabled: true,
        viewBox: "0 0 44 44",
        strokeWidth: 2,
        path: "M1 14.75H42.25M1 28.5H42.25M14.75 1V42.25M28.5 1V42.25M5.58333 1H37.6667C40.198 1 42.25 3.05203 42.25 5.58333V37.6667C42.25 40.198 40.198 42.25 37.6667 42.25H5.58333C3.05203 42.25 1 40.198 1 37.6667V5.58333C1 3.05203 3.05203 1 5.58333 1Z",
    },
    {
        key: "LOGIN",
        enabled: false,
        viewBox: "0 0 24 24",
        strokeWidth: 1.8,
        path: "M15 3H19V21H15 M10 7L15 12L10 17 M15 12H3",
    },
];

const NavIcon: FC<{ item: NavItem }> = ({ item }) => (
    <svg width="28" height="28" viewBox={item.viewBox} fill="none" aria-hidden="true">
        <path
            d={item.path}
            stroke="currentColor"
            strokeWidth={item.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const BottomNavbar: FC = () => (
    <Navbar className="toolbar">
        <Nav className="toolbar-nav">
            {NAV_ITEMS.map((item) =>
                item.enabled ? (
                    <Nav.Link key={item.key} as={NavLink} to={ROUTES[item.key]}>
                        <NavIcon item={item} />
                        {ROUTE_LABELS[item.key]}
                    </Nav.Link>
                ) : (
                    <Nav.Link key={item.key} disabled>
                        <NavIcon item={item} />
                        {ROUTE_LABELS[item.key]}
                    </Nav.Link>
                ),
            )}
        </Nav>
    </Navbar>
);
