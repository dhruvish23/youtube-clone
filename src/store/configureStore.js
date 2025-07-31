import { configureStore } from "@reduxjs/toolkit";
import youtubeReducer from "../features/youtube/youtubeSlice";

const store = configureStore({
    reducer: {
        youtube: youtubeReducer,
    },
})

export default store;