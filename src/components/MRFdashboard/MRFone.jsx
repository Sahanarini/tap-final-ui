import React from 'react'
//import Sidebar from './shared/Sidebar'
//import Header from './shared/Header'
import { Outlet } from 'react-router-dom'
import Header from '../shared/Header'
import MRFsidebar from '../shared/MRFsidebar'

function MRFone() {
    return (
        <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
        <MRFsidebar/>
        <div className="flex flex-col flex-1">
            <Header />
            <div className="flex-1 p-4 min-h-0 overflow-auto">
                <Outlet />
            </div>
        </div>
    </div>
    )
}

export default MRFone
