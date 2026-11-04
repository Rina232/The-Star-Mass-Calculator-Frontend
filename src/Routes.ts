export const ROUTES = {
    FEED: "/feed",
    ADD: "/add",
    CATALOG: "/catalog",
    LOGIN: "/login",
} as const;

export type RouteKey = keyof typeof ROUTES;

export const ROUTE_LABELS: Record<RouteKey, string> = {
    FEED: "Лента",
    ADD: "Добавить",
    CATALOG: "Каталог",
    LOGIN: "Вход",
};
