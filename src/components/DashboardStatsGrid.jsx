import React from 'react'
//import {IoBagHandle} from 'react-icons/io5';
import { GiHumanPyramid } from "react-icons/gi";


function DashboardStatsGrid() {
  return (
    <div className='flex gap-4 w-full'>
        <BoxWrapper>
            <div className='rounded-full h-12 w-12 flex items-center justify-center bg-pink-700'>
                <GiHumanPyramid  className="text-2xl text-white"/>
            </div>
            <div className='pl-4'>
                <span className='text-sm text-gray-500 font-light'>total MRF</span>
                <div className='flex items-center'>
                    <strong className='text-xl text-gray-700 font-semibold'>12</strong>
                </div>
            </div>
        </BoxWrapper>
        <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-pink-700'>
                <GiHumanPyramid className="text-2xl text-white"/>
            </div>
            <div className='pl-4'>
                <span className='text-sm text-gray-500 font-light'>Resolved</span>
                <div className='flex items-center'>
                    <strong className='text-xl text-gray-700 fony-semibold'>12</strong>
                </div>
            </div>
        </BoxWrapper>
        <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-pink-700'>
                <GiHumanPyramid className="text-2xl text-white"/>
            </div>
            <div className='pl-4'>
                <span className='text-sm text-gray-500 font-light'>Pending</span>
                <div className='flex items-center'>
                    <strong className='text-xl text-gray-700 fony-semibold'>12</strong>
                </div>
            </div>
        </BoxWrapper>
        <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-pink-700'>
                <GiHumanPyramid className="text-2xl text-white"/>
            </div>
            <div className='pl-4'>
                <span className='text-sm text-gray-500 font-light'>Progress</span>
                <div className='flex items-center'>
                    <strong className='text-xl text-gray-700 fony-semibold'>12</strong>
                </div>
            </div>
        </BoxWrapper>

    </div>
  )
}

export default DashboardStatsGrid


function BoxWrapper({children}){
    return <div className="bg-white rounded-sm p-4 flex-1 border-gray-200 flex items-center">{children}</div>
}