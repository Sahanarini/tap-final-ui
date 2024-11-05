import React from 'react'
import DashboardStatsGrid from '../DashboardStatsGrid';
import ProgressChart from '../ProgressChart';
import Piechart from '../Piechart';
//import MRFList from './MRFList';
import MRFbuttons from '../Buttons';
import CandidateList from '../CandidateList';
 
function MRFonedashboard() {
    return (
        <div className='flex flex-col gap-4 h-screen'>
          {/* <DashboardStatsGrid/> */}
          <div className='flex flex-row gap-4 w-full'>
            <ProgressChart />
            <Piechart />
             {/* <MRFbuttons/> */}
          </div>
          <div className='flex flex-row gap-4 w-full'>
           
             <MRFbuttons/>
          </div>
          <div className="flex flex-row gap-4 w-full">
            <CandidateList />
          </div>
        </div>
      );
}


export default MRFonedashboard
