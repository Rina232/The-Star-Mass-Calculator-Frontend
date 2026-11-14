import { configureStore } from "@reduxjs/toolkit";
import draftReducer from "../slices/draftSlice";
import feedReducer from "../slices/feedSlice";
import starClassesReducer from "../slices/starClassesSlice";
import uiReducer from "../slices/uiSlice";
import userReducer from "../slices/userSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        starClasses: starClassesReducer,
        feed: feedReducer,
        draft: draftReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: { ignoredActionPaths: ["meta.arg"] },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
