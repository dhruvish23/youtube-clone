import React from 'react'
import { GoHome } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { LiaDownloadSolid } from "react-icons/lia";
import { useAppSelector } from '../hooks/useApp';

const Sidebar = () => {
    const sidebarCollapsed = useAppSelector((state) => state.youtube.sidebarCollapsed);

    const mainItems = [
        { icon: GoHome, text: "Home", active: true },
        { icon: SiYoutubeshorts, text: "Shorts" },
        { icon: MdOutlineSubscriptions, text: "Subscriptions" },
    ];

    const libraryItems = [
        { icon: LiaDownloadSolid, text: "Downloads" },
    ];

    if (sidebarCollapsed) {
        // Collapsed sidebar - only show icons
        return (
            <div className='w-20 bg-[#212121] text-white transition-all duration-300 overflow-hidden'>
                <div className='flex flex-col items-center py-4 space-y-4'>
                    {mainItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors ${item.active ? 'bg-zinc-700' : ''}`}
                        >
                            <item.icon className="text-2xl mb-1" />
                            <span className="text-xs">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Expanded sidebar - show full menu
    return (
        <div className='w-2/12 bg-[#212121] text-white pr-5 transition-all duration-300 overflow-hidden'>
            <div className='pl-6 py-4'>
                {/* Main Items */}
                <div className='mb-6'>
                    {mainItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-5 hover:bg-zinc-700 duration-300 rounded-xl p-2 cursor-pointer ${item.active ? 'bg-zinc-700' : ''}`}
                        >
                            <item.icon className="text-xl" />
                            <span className="text-sm tracking-wider">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className='border-b-2 border-gray-700 mb-4'></div>

                {/* Library Section */}
                <div className='mb-4'>
                    <h3 className='text-sm font-semibold mb-3 text-gray-300'>Library</h3>
                    {libraryItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-5 hover:bg-zinc-700 duration-300 rounded-xl p-2 cursor-pointer"
                        >
                            <item.icon className="text-xl" />
                            <span className="text-sm tracking-wider">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className='border-b-2 border-gray-700 mb-4'></div>

                {/* Browse Section */}
                <div className='mb-4'>
                    <h3 className='text-sm font-semibold mb-3 text-gray-300'>Explore</h3>
                    <div className="flex items-center gap-5 hover:bg-zinc-700 duration-300 rounded-xl p-2 cursor-pointer">
                        <span className="text-xl">🔥</span>
                        <span className="text-sm tracking-wider">Trending</span>
                    </div>
                    <div className="flex items-center gap-5 hover:bg-zinc-700 duration-300 rounded-xl p-2 cursor-pointer">
                        <span className="text-xl">🎵</span>
                        <span className="text-sm tracking-wider">Music</span>
                    </div>
                    <div className="flex items-center gap-5 hover:bg-zinc-700 duration-300 rounded-xl p-2 cursor-pointer">
                        <span className="text-xl">🎮</span>
                        <span className="text-sm tracking-wider">Gaming</span>
                    </div>
                    <div className="flex items-center gap-5 hover:bg-zinc-700 duration-300 rounded-xl p-2 cursor-pointer">
                        <span className="text-xl">📰</span>
                        <span className="text-sm tracking-wider">News</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar