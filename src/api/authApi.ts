import axios from "axios";
import type { UserResponseDto } from "./Api";

const authHttp = axios.create({ baseURL: "/api/users", withCredentials: true });

export const loginUser = async (username: string, password: string): Promise<UserResponseDto> => {
    const response = await authHttp.post<UserResponseDto>("/login", { username, password });
    return response.data;
};

export const logoutUser = async (): Promise<void> => {
    await authHttp.post("/logout");
};
