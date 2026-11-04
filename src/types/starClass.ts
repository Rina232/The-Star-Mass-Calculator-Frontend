export type StarClassStatus = "draft" | "published" | "deleted";

export interface StarClass {
    id: number;
    title: string;
    description: string | null;
    status: StarClassStatus;
    imageUrl: string;
    videoUrl: string;
    mass: number | null;
    luminosity: number | null;
    likeCount: number;
}
