import React, { useEffect } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { BsYoutube } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMicrophone, FaGoogle } from "react-icons/fa";
import { RiVideoAddLine } from "react-icons/ri";
import { BsBell } from 'react-icons/bs';
import profile from '../assets/profile.jpg'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { changeSearchTerm, clearSearchTerm, clearVideos, toggleSidebar } from '../features/youtube/youtubeSlice';
import { getSearchPageVideos } from '../store/reducers/getSearchPageVideos';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { signInWithGoogle, onAuthStateChange } from '../utils/authUtils';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const searchTerm = useAppSelector((state) => state.youtube.searchTerm);

    // Auth state from Redux
    const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChange((firebaseUser) => {
            if (firebaseUser) {
                dispatch(loginSuccess({
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL
                }));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    const handleSearch = () => {
        if (location.pathname !== '/search') {
            navigate('/search');
        }
        else {
            dispatch(clearVideos());
            dispatch(getSearchPageVideos(false));
        }
    }

    const handleHomeNavigation = () => {
        // Clear search term and navigate to home
        dispatch(clearSearchTerm());
        navigate('/');
    }

    const handleSidebarToggle = () => {
        dispatch(toggleSidebar());
    }

    const handleSignIn = async () => {
        dispatch(loginStart());
        const result = await signInWithGoogle();

        if (result.error) {
            dispatch(loginFailure(result.error));
        } else {
            dispatch(loginSuccess(result.user));
        }
    };

    return (
        <div className='flex justify-between px-14 h-14 items-center bg-[#212121] opacity-95 sticky'>
            <div className='flex gap-8 items-center text-2xl'>
                <div
                    className='cursor-pointer hover:bg-zinc-700 p-2 rounded-full transition-colors'
                    onClick={handleSidebarToggle}
                >
                    <GiHamburgerMenu />
                </div>
                <div
                    className='flex gap-2 items-center justify-center cursor-pointer hover:bg-zinc-700 px-3 py-2 rounded-lg transition-colors'
                    onClick={handleHomeNavigation}
                >
                    <BsYoutube className='text-3xl text-red-600' />
                    <span className='text-2xl'>YouTube</span>
                </div>
            </div>
            <div className='flex items-center gap-5 justify-center'>
                <form onSubmit={(e) => { e.preventDefault(); handleSearch() }}>
                    <div className='flex items-center bg-zinc-900 h-10 px-4 pr-0 rounded-3xl'>
                        <div className='flex gap-5 items-center pr-5'>
                            <input
                                className='w-96 bg-zinc-900 focus:outline-none border-none text-white'
                                type="text"
                                placeholder='Search'
                                value={searchTerm}
                                onChange={(e) => dispatch(changeSearchTerm(e.target.value))}
                            />
                        </div>
                        <button
                            type="submit"
                            className='h-10 w-16 flex items-center justify-center bg-zinc-800 rounded-r-3xl hover:bg-zinc-700 transition-colors'
                        >
                            <AiOutlineSearch className='text-xl text-white' />
                        </button>
                    </div>
                </form>

                <div className='text-xl p-3 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 cursor-pointer transition-colors'>
                    <FaMicrophone />
                </div>
            </div>
            <div className='flex items-center gap-5 text-xl text-white'>
                <div className='hover:bg-zinc-700 p-2 rounded-full cursor-pointer transition-colors'>
                    <RiVideoAddLine />
                </div>
                <div className='relative hover:bg-zinc-700 p-2 rounded-full cursor-pointer transition-colors'>
                    <BsBell />
                    <span className='absolute bottom-4 left-4 text-xs text-white bg-red-600 px-1 rounded-full'>{" "}9+{" "}</span>
                </div>

                {/* Authentication Section */}
                {isAuthenticated ? (
                    <ProfileDropdown />
                ) : (
                    <button
                        onClick={handleSignIn}
                        disabled={isLoading}
                        className='flex items-center gap-2 px-3 py-2 border border-blue-500 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                        title="Sign in with Google"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                        ) : (
                            <>
                                <FaGoogle className="text-sm" />
                                <span>Sign in</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar