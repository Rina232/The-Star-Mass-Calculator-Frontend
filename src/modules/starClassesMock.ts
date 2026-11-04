import type { StarClass } from "../types/starClass";
import { STAR_CLASSES_MOCK } from "./mock";

const getPublishedList = (): StarClass[] =>
    STAR_CLASSES_MOCK.filter((item) => item.status === "published").sort((a, b) => a.id - b.id);

export const getPublishedStarClasses = (minMass?: number, maxMass?: number): StarClass[] =>
    getPublishedList().filter((item) => {
        if (item.mass === null) {
            return false;
        }
        if (minMass !== undefined && item.mass < minMass) {
            return false;
        }
        if (maxMass !== undefined && item.mass > maxMass) {
            return false;
        }
        return true;
    });

export const getPublishedStarClassById = (id: number): StarClass | undefined =>
    getPublishedList().find((item) => item.id === id);

export const getFirstPublishedStarClass = (): StarClass | undefined => getPublishedList()[0];

export const getNextPublishedStarClass = (afterId: number): StarClass | undefined => {
    const list = getPublishedList();
    if (list.length === 0) {
        return undefined;
    }
    const index = list.findIndex((item) => item.id === afterId);
    if (index === -1) {
        return list[0];
    }
    return list[(index + 1) % list.length];
};
