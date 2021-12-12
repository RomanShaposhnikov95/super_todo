import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "../hooks/http.hook";



export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    async () => {
        const {request} = useHttp();
        return await request("http://localhost:3001/filtersByColor")
    }
)


const filterSlice = createSlice({
    name: 'filters',
    initialState: {
        filters: [],
        filtersLoadingStatus: 'null',
        activeFilter: ['all'],
        count: 0,
        value: 'all'
    },
    reducers: {
        todoCount: (state,action) => {
            state.count = action.payload
        },
        filterChanged: (state,action) => {
            let arr = [...state.activeFilter]

            if(action.payload === 'all') {
                arr = [action.payload]
            } else if (arr.includes(action.payload)) {
                arr = arr.filter(el => el !== action.payload)
                if(!arr.length) arr = ['all']
            } else {
                arr = [...arr.filter(el => el !== 'all'), action.payload]
            }

            return {...state, activeFilter: arr}
        },
        filterByBoolean: (state,action) => {
            state.value = action.payload
        }
    },
    extraReducers: {
        [fetchFilters.pending]: (state) => {state.filtersLoadingStatus = 'loading'},
        [fetchFilters.fulfilled]: (state,action) => {
            state.filtersLoadingStatus = 'null';
            state.filters = action.payload;
        },
        [fetchFilters.rejected]: (state) => {state.filtersLoadingStatus = 'error'}
    }
})

export const {todoCount,filterChanged,filterByBoolean} = filterSlice.actions
export default filterSlice.reducer;