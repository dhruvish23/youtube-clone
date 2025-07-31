import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { getVideoDetails } from '../store/reducers/getVideoDetails';

export default function Card({ data }) {
    const sidebarCollapsed = useAppSelector((state) => state.youtube.sidebarCollapsed);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleVideoClick = () => {
        dispatch(getVideoDetails(data.videoId)); // this sets currentVideo in Redux
        navigate(`/watch/${data.videoId}`);
    };

    return (
        <div className="flex flex-col gap-3 transition-all duration-300">
            <div className='relative'>
                <span className={`absolute bottom-3 right-3 text-sm bg-gray-900 px-2 py-0.5 z-10 rounded ${sidebarCollapsed ? 'text-base px-3 py-1' : 'text-sm px-2 py-0.5'}`}>
                    {data.videoDuration}
                </span>
                <div onClick={handleVideoClick}>
                    <img
                        src={data.videoThumbnail}
                        alt="Thumbnail"
                        className={`w-full rounded-lg hover:scale-105 transition-transform cursor-pointer ${sidebarCollapsed
                            ? 'h-48 sm:h-52 md:h-56'
                            : 'h-44 sm:h-48 md:h-52'
                            }`}
                    />
                </div>
            </div>
            <div className='flex gap-3'>
                <div className='min-w-fit'>
                    <a href='#'>
                        <img
                            src={data.channelInfo.image}
                            alt="Channel"
                            className={`rounded-full ${sidebarCollapsed ? 'h-11 w-11' : 'h-9 w-9'}`}
                        />
                    </a>
                </div>
                <div className='flex-1'>
                    <h3 className='mb-1'>
                        <div
                            onClick={handleVideoClick}
                            className={`line-clamp-2 text-white hover:text-gray-300 font-medium cursor-pointer ${sidebarCollapsed ? 'text-base' : 'text-sm'}`}
                        >
                            {data.videoTitle}
                        </div>
                    </h3>
                    <div className={`text-gray-400 ${sidebarCollapsed ? 'text-sm' : 'text-sm'}`}>
                        <div className='mb-1'>
                            <a href="#" className={`hover:text-white ${sidebarCollapsed ? 'text-sm' : 'text-xs'}`}>
                                {data.channelInfo.name}
                            </a>
                        </div>
                        <div className={`${sidebarCollapsed ? 'text-sm' : 'text-xs'}`}>
                            <span className='after:content-["•"] after:mx-1'>
                                {data.videoViews} views
                            </span>
                            <span>{data.videoAge}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
