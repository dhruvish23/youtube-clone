import React, { useEffect } from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { getHomePageVideos } from '../store/reducers/getHomePageVideos';
import Spinner from '../components/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../components/Card';
import { clearVideos, clearSearchTerm } from '../features/youtube/youtubeSlice';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const Home = () => {
  const dispatch = useAppDispatch();
  const videos = useAppSelector((state) => state.youtube.videos);
  const sidebarCollapsed = useAppSelector((state) => state.youtube.sidebarCollapsed);

  useEffect(() => {
    NProgress.start();
    dispatch(clearSearchTerm());
    dispatch(clearVideos());
    dispatch(getHomePageVideos(false)).finally(() => { NProgress.done(); });
  }, [dispatch]);

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
              id="home-scrollable-div"
              className='h-full overflow-y-auto'
              style={{ height: "92.5vh" }}
            >
              <InfiniteScroll
                dataLength={videos.length}
                next={() => dispatch(getHomePageVideos(true))}
                hasMore={videos.length < 500}
                loader={<div className='flex justify-center py-4'><Spinner /></div>}
                scrollableTarget="home-scrollable-div"
                endMessage={
                  <p className='text-center py-4 text-gray-500'>
                    <b>You have seen all videos!</b>
                  </p>
                }
              >
                {/* Changed grid to be responsive and allow wider thumbnails */}
                <div className={`grid gap-y-8 gap-x-6 p-8 ${sidebarCollapsed
                  ? 'grid-cols-2 xl:grid-cols-3' // 2 cols when sidebar collapsed, 3 on xl screens
                  : 'grid-cols-3 xl:grid-cols-3'  // 3 cols when sidebar expanded, 4 on xl screens
                  }`}>
                  {videos.map((item) => (
                    <Card data={item} key={item.videoId} />
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

export default Home