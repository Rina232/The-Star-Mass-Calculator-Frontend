import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";
import type { StarClassResponseDto } from "../api/Api";
import { MASS_MAX, MASS_MIN } from "../constants";
import { getPublishedStarClasses } from "../modules/starClassesMock";
import { loggedOut } from "../store/sessionActions";
import { getErrorMessage, isBackendUnavailable } from "../utils/errors";
import type { UserState } from "./userSlice";

export interface StarClassesState {
    minMass: number;
    maxMass: number;
    items: StarClassResponseDto[];
    error: string | null;
}

interface ThunkState {
    user: UserState;
    starClasses: StarClassesState;
}

const initialState: StarClassesState = {
    minMass: MASS_MIN,
    maxMass: MASS_MAX,
    items: [],
    error: null,
};

export const getStarClassesList = createAsyncThunk<
    StarClassResponseDto[],
    void,
    { state: ThunkState; rejectValue: string }
>("starClasses/getStarClassesList", async (_, { getState, rejectWithValue }) => {
    const { starClasses, user } = getState();
    const { minMass, maxMass } = starClasses;

    try {
        const response = await api.starClasses.getPublishedStarClasses({
            minMass: minMass > MASS_MIN ? minMass : undefined,
            maxMass: maxMass < MASS_MAX ? maxMass : undefined,
        });
        return response.data;
    } catch (error) {
        if (!user.isAuthenticated && isBackendUnavailable(error)) {
            return getPublishedStarClasses(minMass, maxMass);
        }
        return rejectWithValue(getErrorMessage(error, "Не удалось загрузить спектральные классы"));
    }
});

export const deleteStarClass = createAsyncThunk<
    number,
    number,
    { state: ThunkState; rejectValue: string }
>("starClasses/deleteStarClass", async (id, { dispatch, rejectWithValue }) => {
    try {
        await api.starClasses.deleteStarClass(id);
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Не удалось удалить спектральный класс"));
    }
    await dispatch(getStarClassesList());
    return id;
});

const starClassesSlice = createSlice({
    name: "starClasses",
    initialState,
    reducers: {
        setMinMass(state, action: PayloadAction<number>) {
            state.minMass = action.payload;
        },
        setMaxMass(state, action: PayloadAction<number>) {
            state.maxMass = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStarClassesList.pending, (state) => {
                state.error = null;
            })
            .addCase(getStarClassesList.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(getStarClassesList.rejected, (state, action) => {
                state.items = [];
                state.error = action.payload ?? "Ошибка при загрузке данных";
            })
            .addCase(deleteStarClass.rejected, (state, action) => {
                state.error = action.payload ?? "Ошибка при удалении";
            })
            .addCase(loggedOut, () => initialState);
    },
});

export const { setMinMass, setMaxMass } = starClassesSlice.actions;
export default starClassesSlice.reducer;
