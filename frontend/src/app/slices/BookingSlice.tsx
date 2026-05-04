import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
    filters: {
        status: string;
        search: string;
        dateFrom: string;
        dateTo: string;
    };
}

const initialState: BookingState = {
    filters: {
        status: "All",
        search: "",
        dateFrom: "",
        dateTo: "",
    },
};

export const bookingSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        // Action pour mettre à jour les filtres depuis n'importe quel composant
        setFilters: (state, action: PayloadAction<Partial<BookingState["filters"]>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        // Action pour réinitialiser les filtres
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
    },
});

export const { setFilters, resetFilters } = bookingSlice.actions;
export default bookingSlice.reducer;