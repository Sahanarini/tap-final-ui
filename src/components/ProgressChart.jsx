// import { Legend } from '@headlessui/react';
// import React from 'react'
// import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

// const data = [
// 	{
// 		name: 'Jan',
// 		MRF: 3324,
// 		hired: 1212
// 	},
// 	{
// 		name: 'Feb',
// 		MRF: 1212,
// 		hired: 2216
// 	},
// 	{
// 		name: 'Mar',
// 		MRF: 6765,
// 		hired: 5698
// 	},
// 	{
// 		name: 'Apr',
// 		MRF: 2232,
// 		hired: 1000
// 	},
// 	{
// 		name: 'May',
// 		MRF: 3432,
// 		hired: 1212
// 	},
// 	{
// 		name: 'Jun',
// 		MRF: 2326,
// 		hired: 2400
// 	},
// 	{
// 		name: 'July',
// 		MRF: 3213,
// 		hired: 2121
// 	},
// 	{
// 		name: 'Aug',
// 		MRF: 4000,
// 		hired: 2400
// 	},
// 	{
// 		name: 'Sep',
// 		MRF: 3212,
// 		hired: 2400
// 	},
// 	{
// 		name: 'Oct',
// 		MRF: 4231,
// 		hired: 2400
// 	},
// 	{
// 		name: 'Nov',
// 		MRF: 3221,
// 		hired: 1111
// 	},
// 	{
// 		name: 'Dec',
// 		MRF: 5435,
// 		hired: 2400
// 	}
// ]
// function ProgressChart() {
//   return (
//     <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
// 			<strong className="text-gray-700 font-medium">wertyui</strong>
// 			<div className="mt-3 w-full flex-1 text-xs">
// 				<ResponsiveContainer width="100%" height="100%">
// 					<BarChart
// 						width={500}
// 						height={300}
// 						data={data}
// 						margin={{
// 							top: 20,
// 							right: 10,
// 							left: -10,
// 							bottom: 0
// 						}}
// 					>
// 						<CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
// 						<XAxis dataKey="name" />
// 						<YAxis />
// 						<Tooltip />
// 						<Legend />
// 						<Bar dataKey="MRF" fill="#0ea5e9" />
// 						<Bar dataKey="hired" fill="#ea580c" />
// 					</BarChart>
// 				</ResponsiveContainer>
// 			</div>
// 		</div>
//   )
// }

// export default ProgressChart

import React from 'react';
import { AgChartsReact } from 'ag-charts-react';
import { AgCharts } from 'ag-charts-react';

const data = [
    { name: 'Jan', MRF: 3324, hired: 1212 },
    { name: 'Feb', MRF: 1212, hired: 2216 },
    { name: 'Mar', MRF: 6765, hired: 5698 },
    { name: 'Apr', MRF: 2232, hired: 1000 },
    { name: 'May', MRF: 3432, hired: 1212 },
    { name: 'Jun', MRF: 2326, hired: 2400 },
    { name: 'July', MRF: 3213, hired: 2121 },
    { name: 'Aug', MRF: 4000, hired: 2400 },
    { name: 'Sep', MRF: 3212, hired: 2400 },
    { name: 'Oct', MRF: 4231, hired: 2400 },
    { name: 'Nov', MRF: 3221, hired: 1111 },
    { name: 'Dec', MRF: 5435, hired: 2400 }
];

function ProgressChart() {
  const options = {
      data: data,
      title: {
          text: 'Monthly MRF and Hired Data',
          fontSize: 18,
      },
      axes: [
          {
              type: 'category',
              position: 'bottom',
              label: {
                  rotation: -30
              }
          },
          {
              type: 'number',
              position: 'left',
              title: 'Values',
          }
      ],
      series: [
          {
              type: 'bar',
              xKey: 'name',
              yKey: 'MRF',
              fill: '#0ea5e9',
              tooltip: {
                  renderer: (params) => {
                      return {
                          content: `MRF: ${params.datum.MRF}`
                      };
                  }
              }
          },
          {
              type: 'bar',
              xKey: 'name',
              yKey: 'hired',
              fill: '#ea580c',
              tooltip: {
                  renderer: (params) => {
                      return {
                          content: `Hired: ${params.datum.hired}`
                      };
                  }
              }
          }
      ]
  };

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Monthly Progress</strong>
      <div className="mt-3 w-full flex-1">
        <AgCharts options={options} />
      </div>
    </div>
  );
}

export default ProgressChart;