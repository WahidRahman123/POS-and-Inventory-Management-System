import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 35,
    },
    reducers: {
        increment: (state) => {
            state.value += 1; 
        }
    }
})

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;