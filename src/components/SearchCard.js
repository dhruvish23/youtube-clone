import React from 'react';
import { Link } from 'react-router-dom';

export default function SearchCard({ data }) {
    return (
        <div className='flex gap-4 hover:bg-zinc-800 p-2 rounded-lg transition-colors'>
            <div className='relative flex-shrink-0'>
                <span className='absolute bottom-3 right-3 text-sm bg-gray-900 px-2 py-0.5 z-10 rounded'>
                    {data.videoDuration}
                </span>
                <Link to={`/watch/${data.videoId}`}>
                    <img
                        src={data.videoThumbnail}
                        alt="Thumbnail"
                        className='h-44 w-72 rounded-lg hover:scale-105 transition-transform cursor-pointer'
                    />
                </Link>
            </div>
            <div className='flex gap-1 flex-col flex-1'>
                <h3 className='max-w-2xl mb-2'>
                    <Link
                        to={`/watch/${data.videoId}`}
                        className='line-clamp-2 text-white hover:text-gray-300 text-lg font-medium'
                    >
                        {data.videoTitle}
                    </Link>
                </h3>
                <div className='text-sm text-gray-400 mb-3'>
                    <div>
                        <span className='after:content-["•"] after:mx-1'>
                            {data.videoViews} views
                        </span>
                        <span>{data.videoAge}</span>
                    </div>
                </div>
                <div className='min-w-fit my-2'>
                    <a href='#' className='flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors'>
                        <img
                            src={data.channelInfo.image}
                            alt="Channel"
                            className='h-9 w-9 rounded-full'
                        />
                        <span>{data.channelInfo.name}</span>
                    </a>
                </div>
                <div className='max-w-2xl line-clamp-2 text-sm text-gray-400 mt-2'>
                    <p>{data.videoDescription}</p>
                </div>
            </div>
        </div>
    )
}