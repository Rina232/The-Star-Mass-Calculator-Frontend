import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loggedOut } from "../store/sessionActions";

export interface UserState {
    isAuthenticated: boolean;
    userId: number | null;
    username: string;
}

const initialState: UserState = {
    isAuthenticated: false,
    userId: null,
    username: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<{ id: number; username: string }>) {
            state.isAuthenticated = true;
            state.userId = action.payload.id;
            state.username = action.payload.username;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loggedOut, () => initialState);
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
