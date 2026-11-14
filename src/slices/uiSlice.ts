import { createSlice } from "@reduxjs/toolkit";

interface UiState {
    pendingRequests: number;
}

const initialState: UiState = {
    pendingRequests: 0,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.pendingRequests += 1;
                },
            )
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"),
                (state) => {
                    state.pendingRequests = Math.max(0, state.pendingRequests - 1);
                },
            );
    },
});

export default uiSlice.reducer;
