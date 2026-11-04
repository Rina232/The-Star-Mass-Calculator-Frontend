import type { FC } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ROUTES, ROUTE_LABELS, type RouteKey } from "../Routes";

interface NavItem {
    key: RouteKey;
    enabled: boolean;
    icon: string;
}

const NAV_ITEMS: NavItem[] = [
    { key: "FEED", enabled: true, icon: "M6 3L20 12L6 21Z" },
    { key: "ADD", enabled: false, icon: "M12 3V21M3 12H21" },
    { key: "CATALOG", enabled: true, icon: "M3 3H21V21H3Z M3 9H21 M3 15H21 M9 3V21 M15 3V21" },
    { key: "LOGIN", enabled: false, icon: "M15 3H19V21H15 M10 7L15 12L10 17 M15 12H3" },
];

const NavIcon: FC<{ path: string }> = ({ path }) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const BottomNavbar: FC = () => (
    <Navbar className="toolbar">
        <Nav className="toolbar-nav">
            {NAV_ITEMS.map((item) =>
                item.enabled ? (
                    <Nav.Link key={item.key} as={NavLink} to={ROUTES[item.key]}>
                        <NavIcon path={item.icon} />
                        {ROUTE_LABELS[item.key]}
                    </Nav.Link>
                ) : (
                    <Nav.Link key={item.key} disabled>
                        <NavIcon path={item.icon} />
                        {ROUTE_LABELS[item.key]}
                    </Nav.Link>
                ),
            )}
        </Nav>
    </Navbar>
);
