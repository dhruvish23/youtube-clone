import React, { useEffect } from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { getSearchPageVideos } from '../store/reducers/getSearchPageVideos';
import Spinner from '../components/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { clearVideos } from '../features/youtube/youtubeSlice';
import SearchCard from '../components/SearchCard';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


const Search = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const videos = useAppSelector((state) => state.youtube.videos);
    const searchTerm = useAppSelector((state) => state.youtube.searchTerm);
    const sidebarCollapsed = useAppSelector((state) => state.youtube.sidebarCollapsed);

    useEffect(() => {
        dispatch(clearVideos());
        if (searchTerm === "") {
            navigate("/");
        } else {
            NProgress.start();
            dispatch(getSearchPageVideos(false))
                .finally(() => {
                    NProgress.done();
                });
        }
    }, [dispatch, navigate, searchTerm]);

    return (
        <div className='h-screen flex flex-col'>
            <div style={{ height: "7.5vh" }}>
                <Navbar />
            </div>
            <div className='flex flex-1' style={{ height: "92.5vh" }}>
                <Sidebar />
                <div className='flex-1 overflow-hidden'>
                    {videos.length ? (
                        <div
                            id="search-scrollable-div"
                            className='h-full overflow-y-auto'
                            style={{ height: "92.5vh" }}
                        >
                            <InfiniteScroll
                                dataLength={videos.length}
                                next={() => dispatch(getSearchPageVideos(true))}
                                hasMore={videos.length < 500}
                                loader={<div className='flex justify-center py-4'><Spinner /></div>}
                                scrollableTarget="search-scrollable-div"
                                endMessage={
                                    <p className='text-center py-4 text-gray-500'>
                                        <b>No more search results!</b>
                                    </p>
                                }
                            >
                                <div className={`py-8 px-8 space-y-6 ${sidebarCollapsed ? 'pl-6' : 'pl-8'
                                    }`}>
                                    {videos.map((item) => (
                                        <SearchCard data={item} key={item.videoId} />
                                    ))}
                                </div>
                            </InfiniteScroll>
                        </div>
                    ) : (
                        <div className='flex-1 flex items-center justify-center'>
                            <Spinner />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Search