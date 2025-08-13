// components/ProfileDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useApp';
import { logout } from '../features/auth/authSlice';
import { signOutUser } from '../utils/authUtils';
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';
import { MdOutlineVideoLibrary } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { createPortal } from 'react-dom';
const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    // Debug logging - remove this after fixing
    console.log('ProfileDropdown - User data:', user);
    console.log('ProfileDropdown - Photo URL:', user?.photoURL);
    console.log('ProfileDropdown - Image Error:', imageError);

    // Fix Google profile image URL for better CORS handling
    const getOptimizedPhotoURL = (photoURL) => {
        if (!photoURL) return null;
        // Remove size restriction and add parameters for better loading
        return photoURL.replace(/=s\d+-c$/, '=s96-c-k-no');
    };

    const optimizedPhotoURL = getOptimizedPhotoURL(user?.photoURL);

    const handleImageError = () => {
        console.log('Image failed to load:', optimizedPhotoURL);
        setImageError(true);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset image error when user changes
    useEffect(() => {
        setImageError(false);
    }, [user?.photoURL]);

    const handleSignOut = async () => {
        const result = await signOutUser();
        if (!result.error) {
            dispatch(logout());
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 hover:bg-zinc-700 p-2 rounded-full transition-colors"
            >
                {optimizedPhotoURL && !imageError ? (
                    <img
                        src={optimizedPhotoURL}
                        alt={user?.displayName || 'User'}
                        className="w-9 h-9 rounded-full cursor-pointer hover:ring-2 hover:ring-white transition-all object-cover"
                        onError={handleImageError}
                        onLoad={() => console.log('Image loaded successfully:', optimizedPhotoURL)}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <FaUserCircle className="w-9 h-9 text-zinc-400 cursor-pointer hover:text-white transition-colors" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#212121] rounded-lg shadow-xl border border-zinc-700 z-[9999]">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-zinc-700">
                        <div className="flex items-center space-x-3">
                            {optimizedPhotoURL && !imageError ? (
                                <img
                                    src={optimizedPhotoURL}
                                    alt={user?.displayName || 'User'}
                                    className="w-12 h-12 rounded-full object-cover"
                                    onError={handleImageError}
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <FaUserCircle className="w-12 h-12 text-zinc-400" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-white text-sm">{user?.displayName}</p>
                                <p className="text-xs text-zinc-400">{user?.email}</p>
                                <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">
                                    Manage your Google Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Menu Options */}
                    <div className="py-2">
                        <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-zinc-700 flex items-center space-x-3 transition-colors">
                            <HiOutlineUser className="w-5 h-5" />
                            <span>Your channel</span>
                        </button>

                        <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-zinc-700 flex items-center space-x-3 transition-colors">
                            <MdOutlineVideoLibrary className="w-5 h-5" />
                            <span>Your videos</span>
                        </button>

                        <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-zinc-700 flex items-center space-x-3 transition-colors">
                            <HiOutlineCog className="w-5 h-5" />
                            <span>Settings</span>
                        </button>

                        <div className="border-t border-zinc-700 mt-2 pt-2">
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-zinc-700 flex items-center space-x-3 transition-colors"
                            >
                                <HiOutlineLogout className="w-5 h-5" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;