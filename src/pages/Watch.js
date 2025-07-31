import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { getVideoDetails } from '../store/reducers/getVideoDetails';
import { getRecommendedVideos } from '../store/reducers/getRecommendedVideos';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import Sidebar from '../components/Sidebar';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function Watch() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const currentVideo = useAppSelector((state) => state.youtube.currentVideo);
    const loading = useAppSelector((state) => state.youtube.loading);
    const recommendedVideos = useAppSelector((state) => state.youtube.recommendedVideos);
    const sidebarCollapsed = useAppSelector((state) => state.youtube.sidebarCollapsed);

    console.log('Recommended Videos Array:', recommendedVideos);

    useEffect(() => {
        if (id) {
            NProgress.start();
            dispatch(getVideoDetails(id))
                .finally(() => {
                    NProgress.done();
                });
        } else {
            navigate('/');
        }
    }, [id, navigate, dispatch]);

    useEffect(() => {


        if (currentVideo && id && currentVideo.channelInfo) {
            console.log('Dispatching getRecommendedVideos for ID:', id);
            console.log('Channel ID:', currentVideo.channelInfo.id);
            dispatch(getRecommendedVideos(id));
        } else {
            console.log('Not dispatching getRecommendedVideos because:');
            console.log('- currentVideo:', !!currentVideo);
            console.log('- id:', !!id);
            console.log('- channelInfo:', !!currentVideo?.channelInfo);
        }
    }, [currentVideo, dispatch, id]);

    // Show loading spinner while fetching video details
    if (loading || !currentVideo) {
        return (
            <div className='h-screen flex flex-col'>
                <div style={{ height: "7.5vh" }}>
                    <Navbar />
                </div>
                <div className='flex-1 flex items-center justify-center'>
                    <Spinner />
                </div>
            </div>
        );
    }

    return (
        <div className='h-screen flex flex-col'>
            {/* Navbar stays fixed at top */}
            <div style={{ height: "7.5vh" }}>
                <Navbar />
            </div>

            <div className='flex flex-1 overflow-hidden' style={{ height: '92.5vh' }}>
                <Sidebar />

                {/* Scrollable content area */}
                <div className='flex flex-1 gap-6 p-6 overflow-y-auto scrollbar-none'>

                    {/* Main Video Area */}
                    <div className="flex flex-col flex-1">
                        <div className='mb-4'>
                            <iframe
                                width="100%"
                                height="500"
                                src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                                title="YouTube Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className='rounded-lg'
                            ></iframe>
                        </div>

                        {/* Video Details */}
                        <div className='mb-4'>
                            <h1 className='text-xl font-bold mb-2'>{currentVideo.videoTitle}</h1>
                            <div className='flex items-center gap-4 text-gray-600 text-sm mb-4'>
                                <span>{currentVideo.videoViews} views</span>
                                <span>{currentVideo.videoAge}</span>
                                {currentVideo.videoLikes && <span>{currentVideo.videoLikes} likes</span>}
                            </div>

                            <div className='flex items-center gap-3 mb-4'>
                                <img
                                    src={currentVideo.channelInfo.image}
                                    alt={currentVideo.channelInfo.name}
                                    className='w-10 h-10 rounded-full'
                                />
                                <div>
                                    <div className='font-medium'>{currentVideo.channelInfo.name}</div>
                                    {currentVideo.channelInfo.subscribers && (
                                        <div className='text-gray-600 text-sm'>{currentVideo.channelInfo.subscribers} subscribers</div>
                                    )}
                                </div>
                            </div>

                            <div className='bg-gray-100 p-3 rounded-lg'>
                                <p className='text-sm whitespace-pre-wrap line-clamp-3'>
                                    {currentVideo.videoDescription}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Videos */}
                    <div className='w-96 shrink-0'>
                        <h3 className='font-bold mb-4'>Recommended</h3>

                        <div className="space-y-3">
                            {recommendedVideos && recommendedVideos.length > 0 ? (
                                recommendedVideos.map((video, index) => (
                                    <div
                                        key={video.videoId || index}
                                        className="flex gap-2 cursor-pointer hover:bg-zinc-800 p-2 rounded"
                                        onClick={() => navigate(`/watch/${video.videoId}`)}
                                    >
                                        <div className="relative w-40 h-24">
                                            <img
                                                src={video.videoThumbnail}
                                                alt={video.videoTitle}
                                                className="w-full h-full object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/160x90?text=No+Image';
                                                }}
                                            />
                                            <span className={`absolute bottom-1 right-1 text-sm bg-gray-900 text-white rounded ${sidebarCollapsed ? 'text-base px-3 py-1' : 'text-xs px-2 py-0.5'}`}>
                                                {video.videoDuration}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium line-clamp-2 mb-1">{video.videoTitle}</h4>
                                            <p className="text-xs text-gray-500">{video.channelInfo?.name}</p>
                                            <p className="text-xs text-gray-600">
                                                {video.videoViews} views • {video.videoAge}
                                            </p>
                                        </div>
                                    </div>

                                ))
                            ) : (
                                <div className='text-center text-gray-500 py-8'>
                                    <p>No recommended videos available</p>
                                    <p className='text-xs mt-2'>Check console for debugging info</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}