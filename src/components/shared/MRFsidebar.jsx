
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
//import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../../constants/navigation'
import { MRFDASHBOARD_SIDEBAR_BOTTOM_LINKS, MRFDASHBOARD_SIDEBAR_LINKS } from '../../constants/mrfnavigation'
import classNames from 'classnames'
import logorz from '../../assets/logorz.png'  
 
const linkClasses = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-white-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'
 
function MRFSidebar() {
  return (
    <div className='bg-gray-300 w-60 p-3 flex flex-col text-white'>
      <div className='flex items-center gap-2 px-1 py-3'>
        <img src={logorz} alt="Logo" className="w-6 h-6" />  {/* Use the logo image */}
        <span className='text-black-100 text-black font-semibold'>RELEVANTZ</span>
      </div>
      <div className='flex-1 py-8 flex flex-col gap-0.5'>
        {MRFDASHBOARD_SIDEBAR_LINKS.map((item) => (
          <MRFSidebarLink key={item.key} item={item} />
        ))}
      </div>
      <div className='flex flex-col gap-0.5 pt-2 border-t border-gray-700'>
        {MRFDASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <MRFSidebarLink key={item.key} item={item} />
        ))}
      </div>
    </div>
  )
}
 
export default MRFSidebar
 
function MRFSidebarLink({ item }) {
  const { pathname } = useLocation()
  return (
    <Link to={item.path} className={classNames(pathname === item.path ? 'bg-white-500 text-black' : 'text-black-400 text-black', linkClasses)}>
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  )
}