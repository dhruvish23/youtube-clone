import axios from 'axios';
import React from 'react';
import { convertRawToString } from './convertRawToString';
import { parseVideoDuration } from './parseVideoDuration';
import { timeSince } from './timeSince';

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const parseRecommendedData = async (items) => {
    console.log("Items received in parseRecommendedData:", items);

    try {
        const videoIds = [];
        const channelIds = [];

        items.forEach((item) => {
            // Handle different API response structures
            const videoId = item.id?.videoId || item.contentDetails?.videoId;
            const channelId = item.snippet?.channelId;

            if (videoId && channelId) {
                videoIds.push(videoId);
                channelIds.push(channelId);
            }
        });

        if (videoIds.length === 0) {
            console.log("No valid video IDs found");
            return [];
        }

        // Get channel data
        const { data: { items: channelsData = [] } = {} } = await axios.get(
            `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${channelIds.join(",")}&key=${API_KEY}`
        );

        // Create channel lookup object (fixed the structure)
        const parsedChannelsData = {};
        channelsData.forEach((channel) => {
            parsedChannelsData[channel.id] = {
                image: channel.snippet.thumbnails.default.url,
            };
        });
        console.log("parsedChannelsData:", parsedChannelsData);

        // Get video details
        const { data: { items: videosData = [] } = {} } = await axios.get(
            `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(",")}&key=${API_KEY}`
        );

        // Create video lookup object for easier access
        const videosLookup = {};
        videosData.forEach((video) => {
            videosLookup[video.id] = video;
        });

        const parseData = [];
        items.forEach((item, index) => {
            const videoId = item.id?.videoId || item.contentDetails?.videoId;
            const channelId = item.snippet?.channelId;

            if (!videoId || !channelId) return;

            // Fixed: Access channel data from object, not using find on object
            const channelData = parsedChannelsData[channelId];
            const videoData = videosLookup[videoId];

            if (channelData && videoData) {
                parseData.push({
                    videoId: videoId,
                    videoTitle: item.snippet.title,
                    videoDescription: item.snippet.description,
                    videoThumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
                    videoLink: `https://www.youtube.com/watch?v=${videoId}`,
                    videoDuration: videoData?.contentDetails?.duration
                        ? parseVideoDuration(videoData.contentDetails.duration)
                        : 'N/A',
                    videoViews: convertRawToString(
                        videoData.statistics.viewCount
                    ),
                    videoAge: timeSince(new Date(item.snippet.publishedAt)),
                    channelInfo: {
                        id: channelId,
                        image: channelData.image,
                        name: item.snippet.channelTitle
                    },
                });
            }
        });

        console.log("Parsed recommended videos:", parseData);
        return parseData;
    } catch (err) {
        console.error("Error in parseRecommendedData:", err);
        return [];
    }
};