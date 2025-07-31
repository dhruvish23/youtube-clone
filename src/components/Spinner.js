import React from 'react'

export default function Spinner() {
    return (
        <div className='flex justify-center items-center w-full'>
            <div className='w-10 h-10 border-2 border-red-500 border-solid rounded-full animate-spin border-t-transparent'>
            </div>
        </div>
    )
}
