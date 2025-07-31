import { createSlice } from "@reduxjs/toolkit";
import { getHomePageVideos } from "../../store/reducers/getHomePageVideos";
import { getSearchPageVideos } from "../../store/reducers/getSearchPageVideos";
import { getRecommendedVideos } from "../../store/reducers/getRecommendedVideos";
import { getVideoDetails } from "../../store/reducers/getVideoDetails";

const initialState = {
    videos: [],
    currentVideo: null,
    loading: false,
    searchTerm: "",
    searchResults: [],
    nextPageToken: null,
    recommendedVideos: [],
    sidebarCollapsed: false, // Add sidebar state
};

const youtubeSlice = createSlice({
    name: "youtube",
    initialState,
    reducers: {
        clearVideos: (state) => {
            state.videos = [];
            state.nextPageToken = null;
        },
        changeSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        clearSearchTerm: (state) => {
            state.searchTerm = "";
        },
        clearCurrentVideo: (state) => {
            state.currentVideo = null;
        },
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed: (state, action) => {
            state.sidebarCollapsed = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Home page videos
        builder.addCase(getHomePageVideos.fulfilled, (state, action) => {
            if (action.payload && action.payload.parsedData) {
                state.videos = action.payload.parsedData;
                state.nextPageToken = action.payload.nextPageToken;
            }
        });

        // Search page videos
        builder.addCase(getSearchPageVideos.fulfilled, (state, action) => {
            if (action.payload && action.payload.parsedData) {
                state.videos = action.payload.parsedData;
                state.nextPageToken = action.payload.nextPageToken;
            }
        });
        // Get Recommended Videos cases - MAKE SURE THESE EXIST
        builder.addCase(getRecommendedVideos.pending, (state) => {
            console.log('Redux: getRecommendedVideos.pending');
            // Don't set loading here if you don't want to show spinner
        })
        builder.addCase(getRecommendedVideos.fulfilled, (state, action) => {
            console.log('Redux: getRecommendedVideos.fulfilled with payload:', action.payload);
            state.recommendedVideos = action.payload;
        })
        builder.addCase(getRecommendedVideos.rejected, (state, action) => {
            console.log('Redux: getRecommendedVideos.rejected with error:', action.error);
            state.recommendedVideos = [];
        });

        // Video details - with loading states
        builder.addCase(getVideoDetails.pending, (state) => {
            state.loading = true;
            state.currentVideo = null;
        });
        builder.addCase(getVideoDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.currentVideo = action.payload;
        });
        builder.addCase(getVideoDetails.rejected, (state) => {
            state.loading = false;
            state.currentVideo = null;
        });
    }
});

export const {
    clearVideos,
    changeSearchTerm,
    clearSearchTerm,
    clearCurrentVideo,
    toggleSidebar,
    setSidebarCollapsed
} = youtubeSlice.actions;

export default youtubeSlice.reducer;