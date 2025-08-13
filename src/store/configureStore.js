import { configureStore } from "@reduxjs/toolkit";
import youtubeReducer from "../features/youtube/youtubeSlice";
import authReducer from "../features/auth/authSlice";

const store = configureStore({
    reducer: {
        youtube: youtubeReducer,
        auth: authReducer,
    },
})

export default store;