import { createAsyncThunk } from "@reduxjs/toolkit";
//creates asynchronious action, simplyfy asynchronious api calls and we can dispatch actions based on results
import axios from "axios";
import { parseData } from "../../utils/parseData";

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const getSearchPageVideos = createAsyncThunk(
    "youtube/App/searchPageVideos",
    async (isNext, { getState }) => {
        //isNext is a boolean, getState is a function
        //getState is a callback function, getState is a function that returns the current state of the store
        const {
            youtube: { nextPageToken: nextPageTokenFromState, videos, searchTerm },
        } = getState();

        const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?&q=${searchTerm}"&key=${API_KEY}&part=snippet&type=video&${isNext ? `pageToken=${nextPageTokenFromState}` : ""}`);
        const items = response.data.items;
        const { parseData: parsedVideos } = await parseData(items); //parseData

        return { parsedData: [...videos, ...parsedVideos], nextPageToken: response.data.nextPageToken };
    }
)
