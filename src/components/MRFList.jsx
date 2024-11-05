import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { getMRFStatus } from './Data'

const recentOrderData = [
	{
		mrfid: '1',
		clientName: 'AvaSoft',
		OpenDate: '2022-05-17',
		CloseDate: '2022-05-17',
		Requirement: '2022-05-17T03:24:00',
		allocated: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '2',
		clientName: 'AvaSoft',
		OpenDate: '2022-05-17',
		CloseDate: '2022-05-17',
		Requirement: '2022-05-17T03:24:00',
		allocated: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '3',
		clientName: 'AvaSoft',
		OpenDate: '2022-05-17',
		CloseDate: '2022-05-17',
		Requirement: '2022-05-17T03:24:00',
		allocated: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '4',
		clientName: 'AvaSoft',
		OpenDate: '2022-05-17',
		CloseDate: '2022-05-17',
		Requirement: '2022-05-17T03:24:00',
		allocated: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '5',
		clientName: 'AvaSoft',
		OpenDate: '2022-05-17',
		CloseDate: '2022-05-17',
		Requirement: '2022-05-17T03:24:00',
		allocated: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '6',
		clientName: 'AvaSoft',
		OpenDate: '2022-05-17',
		CloseDate: '2022-05-17',
		Requirement: '2022-05-17T03:24:00',
		allocated: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	}
]

function MRFList() {
    return (
		<div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
			<strong className="text-gray-700 font-medium">MRF LIST</strong>
			<div className="border-x border-gray-200 rounded-sm mt-3">
				<table className="w-full text-gray-700">
					<thead>
						<tr>
							<th>MRF ID</th>
							<th>Client Name</th>
							<th>Open Date</th>
                            <th>Close Date</th>
							<th>Requirement</th>
							<th>Role</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{recentOrderData.map((order) => (
							<tr key={order.mrfid}>
								<td>
									<Link to={`/order/${order.mrfid}`}>#{order.mrfid}</Link>
								</td>
								<td>
									<Link to={`/mrfone/${order.mrfid}`}>#{order.clientName}</Link>
								</td>
								<td>
									<Link to={`/customer/${order.OpenDate}`}>{order.CloseDate}</Link>
								</td>
								<td>{format(new Date(order.Requirement), 'dd MMM yyyy')}</td>
								<td>{order.allocated}</td>
								<td>{order.Role}</td>
								<td>{getMRFStatus(order.current_order_status)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default MRFList
