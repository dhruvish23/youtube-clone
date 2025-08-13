import { createAsyncThunk } from "@reduxjs/toolkit";
//creates asynchronious action, simplyfy asynchronious api calls and we can dispatch actions based on results
import axios from "axios";
import { parseData } from "../../utils/parseData";

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const getHomePageVideos = createAsyncThunk(
    "youtube/App/homePageVideos",
    async (isNext, { getState }) => {
        //isNext is a boolean, getState is a function
        //getState is a callback function, getState is a function that returns the current state of the store
        const {
            youtube: { nextPageToken: nextPageTokenFromState, videos },
        } = getState();

        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: "snippet,contentDetails,statistics",
                chart: "mostPopular",
                regionCode: "IN", // Change as needed
                maxResults: 20,
                key: API_KEY,
                pageToken: isNext ? nextPageTokenFromState : undefined,
            },
        }
        );

        const items = response.data.items;
        const { parseData: parsedVideos } = await parseData(items);

        return {
            parsedData: [...videos, ...parsedVideos],
            nextPageToken: response.data.nextPageToken,
        };
    }
);
