import React from 'react'
import axios from 'axios';
import { parseVideoDuration } from './parseVideoDuration';
import { convertRawToString } from './convertRawToString';
import { timeSince } from './timeSince';

const API_KEY = process.env.REACT_APP_YOUTUBE_DATA_API_KEY;

export const parseData = async (items) => {
    try {
        const videoIds = [];
        const channelIds = [];

        items.forEach((item) => {
            channelIds.push(item.snippet.channelId);

            // Handle Search API and Videos API formats
            if (item.id.videoId) {
                videoIds.push(item.id.videoId); // Search API
            } else {
                videoIds.push(item.id); // Videos API (mostPopular)
            }
        });

        // Fetch channel details
        const { data: { items: channelsData } } = await axios.get(
            `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${channelIds.join(",")}&key=${API_KEY}`
        );

        const parsedChannelData = channelsData.map(channel => ({
            id: channel.id,
            title: channel.snippet.title,
            image: channel.snippet.thumbnails.default.url,
        }));

        // Fetch video details
        const { data: { items: videosData } } = await axios.get(
            `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(",")}&key=${API_KEY}`
        );

        // Merge everything
        const parsedData = items.map((item, index) => {
            const { image: channelImage } =
                parsedChannelData.find((data) => data.id === item.snippet.channelId) || {};

            const vidId = item.id.videoId || item.id; // Unified video ID

            return {
                videoId: vidId,
                videoTitle: item.snippet.title,
                videoDescription: item.snippet.description,
                videoThumbnail: item.snippet.thumbnails.medium.url,
                videoLink: `https://www.youtube.com/watch?v=${vidId}`,
                videoDuration: parseVideoDuration(videosData[index]?.contentDetails?.duration || ""),
                videoViews: convertRawToString(videosData[index]?.statistics?.viewCount || "0"),
                videoAge: timeSince(new Date(item.snippet.publishedAt)),
                channelInfo: {
                    id: item.snippet.channelId,
                    name: item.snippet.channelTitle,
                    image: channelImage || "",
                },
            };
        });

        return { parseData: parsedData };

    } catch (error) {
        console.log(error);
    }
};
