import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import type { StarClassResponseDto } from "../api/Api";
import {
    getFirstPublishedStarClass,
    getNextPublishedStarClass,
    getPublishedStarClassById,
} from "../modules/starClassesMock";
import { loggedOut } from "../store/sessionActions";
import { getErrorMessage, isBackendUnavailable } from "../utils/errors";
import { setUser } from "./userSlice";
import type { UserState } from "./userSlice";

interface FeedState {
    current: StarClassResponseDto | null;
    notFound: boolean;
    error: string | null;
}

interface ThunkState {
    user: UserState;
}

interface FeedRequest {
    id?: number;
    next?: boolean;
}

const initialState: FeedState = {
    current: null,
    notFound: false,
    error: null,
};

export const getFeedStarClass = createAsyncThunk<
    StarClassResponseDto,
    FeedRequest,
    { state: ThunkState; rejectValue: string }
>("feed/getFeedStarClass", async ({ id, next }, { getState, rejectWithValue }) => {
    try {
        const response = await api.starClasses.getFeedStarClass({ id, next: next ? true : undefined });
        return response.data;
    } catch (error) {
        if (!getState().user.isAuthenticated && isBackendUnavailable(error)) {
            const mock =
                id === undefined
                    ? getFirstPublishedStarClass()
                    : next
                      ? getNextPublishedStarClass(id)
                      : getPublishedStarClassById(id);
            if (mock) {
                return mock;
            }
        }
        return rejectWithValue(getErrorMessage(error, "Не удалось загрузить спектральный класс"));
    }
});

export const likeStarClass = createAsyncThunk<
    StarClassResponseDto,
    { id: number; like: 0 | 1 },
    { rejectValue: string }
>("feed/likeStarClass", async ({ id, like }, { rejectWithValue }) => {
    try {
        const response = await api.starClasses.setStarClassLike(id, { like });
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Не удалось поставить лайк"));
    }
});

const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeedStarClass.pending, (state) => {
                state.error = null;
            })
            .addCase(getFeedStarClass.fulfilled, (state, action) => {
                state.current = action.payload;
                state.notFound = false;
            })
            .addCase(getFeedStarClass.rejected, (state, action) => {
                state.current = null;
                state.notFound = true;
                state.error = action.payload ?? "Ошибка при загрузке данных";
            })
            .addCase(likeStarClass.fulfilled, (state, action) => {
                if (state.current) {
                    state.current = {
                        ...state.current,
                        ...action.payload,
                        isLiked: action.payload.isLiked ?? action.meta.arg.like,
                    };
                }
            })
            .addCase(likeStarClass.rejected, (state, action) => {
                state.error = action.payload ?? "Ошибка при установке лайка";
            })
            .addCase(setUser, () => initialState)
            .addCase(loggedOut, () => initialState);
    },
});

export default feedSlice.reducer;
