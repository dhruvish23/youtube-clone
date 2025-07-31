import { createAsyncThunk } from "@reduxjs/toolkit";
//creates asynchronious action, simplyfy asynchronious api calls and we can dispatch actions based on results
import axios from "axios";
// import { parseData, parseRecommendedData } from "../../utils/parseData";
import { convertRawToString } from "../../utils/convertRawToString";
import { timeSince } from "../../utils/timeSince";

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const getVideoDetails = createAsyncThunk(
    "youtube/App/videoDetails",
    async (id) => {
        //isNext is a boolean, getState is a function
        //getState is a callback function, getState is a function that returns the current state of the store
        const {
            data: { items },
        } = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=snippet,statistics&id=${id}`);

        return parseData(items[0]);
    }
)

const parseData = async (item) => {

    const snippet = item.snippet;
    const statistics = item.statistics;
    const id = item.id;

    const channelResponse = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${item.snippet.channelId}&key=${API_KEY}`);

    const channelImage = channelResponse.data.items[0].snippet.thumbnails.default.url;
    const subscriberCount = channelResponse.data.items[0].statistics.subscriberCount;

    return {
        videoId: id,
        videoTitle: snippet.title,
        videoDescription: snippet.description,
        videoViews: convertRawToString(statistics.viewCount),
        videoLikes: convertRawToString(statistics.likeCount),
        videoAge: timeSince(new Date(snippet.publishedAt)),
        channelInfo: {
            id: snippet.channelId,
            name: snippet.channelTitle,
            image: channelImage,
            subscribers: convertRawToString(subscriberCount, true),
        }
    }

}