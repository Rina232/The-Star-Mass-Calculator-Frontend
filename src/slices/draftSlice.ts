import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import type { PublishStarClassDto, StarClassResponseDto } from "../api/Api";
import { loggedOut } from "../store/sessionActions";
import { getErrorMessage, isNotFound } from "../utils/errors";

interface DraftState {
    draft: StarClassResponseDto | null;
    error: string | null;
}

const initialState: DraftState = {
    draft: null,
    error: null,
};

export const getDraftStarClass = createAsyncThunk<
    StarClassResponseDto | null,
    void,
    { rejectValue: string }
>("draft/getDraftStarClass", async (_, { rejectWithValue }) => {
    try {
        const response = await api.starClasses.getDraftStarClass();
        return response.data;
    } catch (error) {
        if (isNotFound(error)) {
            return null;
        }
        return rejectWithValue(getErrorMessage(error, "Не удалось загрузить черновик"));
    }
});

export const createDraftStarClass = createAsyncThunk<
    StarClassResponseDto,
    { title: string; image?: File; video?: File },
    { rejectValue: string }
>("draft/createDraftStarClass", async (data, { rejectWithValue }) => {
    try {
        const response = await api.starClasses.createDraftStarClass(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Не удалось создать черновик"));
    }
});

export const publishDraftStarClass = createAsyncThunk<
    StarClassResponseDto,
    PublishStarClassDto,
    { rejectValue: string }
>("draft/publishDraftStarClass", async (data, { rejectWithValue }) => {
    try {
        const response = await api.starClasses.publishDraftStarClass(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Не удалось опубликовать спектральный класс"));
    }
});

const draftSlice = createSlice({
    name: "draft",
    initialState,
    reducers: {
        clearDraftError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDraftStarClass.fulfilled, (state, action) => {
                state.draft = action.payload;
            })
            .addCase(getDraftStarClass.rejected, (state, action) => {
                state.error = action.payload ?? "Ошибка при загрузке данных";
            })
            .addCase(createDraftStarClass.pending, (state) => {
                state.error = null;
            })
            .addCase(createDraftStarClass.fulfilled, (state, action) => {
                state.draft = action.payload;
            })
            .addCase(createDraftStarClass.rejected, (state, action) => {
                state.error = action.payload ?? "Ошибка при создании";
            })
            .addCase(publishDraftStarClass.pending, (state) => {
                state.error = null;
            })
            .addCase(publishDraftStarClass.fulfilled, (state) => {
                state.draft = null;
            })
            .addCase(publishDraftStarClass.rejected, (state, action) => {
                state.error = action.payload ?? "Ошибка при публикации";
            })
            .addCase(loggedOut, () => initialState);
    },
});

export const { clearDraftError } = draftSlice.actions;
export default draftSlice.reducer;
