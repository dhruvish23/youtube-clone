import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { parseRecommendedData } from "../../utils/parseRecommendedData";

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const getRecommendedVideos = createAsyncThunk(
    "youtube/App/getRecommendedVideos",
    async (videoId, { getState }) => {

        console.log('Input videoId:', videoId);

        try {
            const state = getState();
            console.log('Redux state:', state);

            const {
                youtube: {
                    currentVideo: {
                        channelInfo: { id: channelId }
                    }
                },
            } = state;

            console.log('channelId:', channelId);

            if (!channelId) {
                console.error('No channelId found in state');
                return [];
            }

            if (!API_KEY) {
                console.error('API_KEY is missing');
                return [];
            }

            // Approach 1: Search for videos from the same channel
            const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=25&key=${API_KEY}`;
            console.log('Search URL:', searchUrl);

            const response = await axios.get(searchUrl);
            console.log('Response:', response.data);

            const items = response.data.items || [];

            if (items.length === 0) {

                // Fallback: Get popular videos
                const fallbackUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=25&key=${API_KEY}`;
                console.log('Fallback URL:', fallbackUrl);

                const fallbackResponse = await axios.get(fallbackUrl);
                console.log('Fallback Response:', fallbackResponse.data);

                // Transform popular videos to match search format
                const transformedItems = (fallbackResponse.data.items || []).map(item => ({
                    id: { videoId: item.id },
                    snippet: item.snippet
                }));

                const parsedData = await parseRecommendedData(transformedItems);
                console.log('Final parsed data from fallback:', parsedData);
                return parsedData;
            }

            const parsedData = await parseRecommendedData(items);
            console.log('Final parsed data:', parsedData);

            return parsedData;

        } catch (error) {
            console.error('Error message:', error.message);
            console.error('Error response:', error.response?.data);

            // Return empty array instead of throwing
            return [];
        }
    }
);