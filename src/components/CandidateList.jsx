import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { getMRFStatus } from './Data'

const recentOrderData = [
	{
		mrfid: '1',
		candidate: 'prabha',
		OpenDate: '2022-05-17',
		experience: '5 y',
		Requirement: '2022-05-17T03:24:00',
		location: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '1',
		candidate: 'sahana',
		OpenDate: '2022-05-17',
		experience: '2 y',
		Requirement: '2022-05-17T03:24:00',
		location: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '1',
		candidate: 'velan',
		OpenDate: '2022-05-17',
		experience: '6 y',
		Requirement: '2022-05-17T03:24:00',
		location: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '1',
		candidate: 'supraja',
		OpenDate: '2022-05-17',
		experience: '3 y',
		Requirement: '2022-05-17T03:24:00',
		location: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '1',
		candidate: 'karthi',
		OpenDate: '2022-05-17',
		experience: '3 y',
		Requirement: '2022-05-17T03:24:00',
		location: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	},
    {
		mrfid: '1',
		candidate: 'nanda',
		OpenDate: '2022-05-17',
		experience: '3 y',
		Requirement: '2022-05-17T03:24:00',
		location: '20',
		current_order_status: 'PENDING',
		Role: 'Java Developer'
	}
]

function CandidateList() {
    return (
		<div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
			<strong className="text-gray-700 font-medium">CANDIDATE LIST</strong>
			<div className="border-x border-gray-200 rounded-sm mt-3">
				<table className="w-full text-gray-700">
					<thead>
						<tr>
							<th>MRF ID</th>
							<th>Candidate Name</th>
							<th>Experience</th>
							<th>Location</th>
							<th>Role</th>
                            <th>Match %</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{recentOrderData.map((p) => (
							<tr key={p.mrfid}>
								<td>{p.mrfid}
								</td>
								<td>
									{p.candidate}
								</td>
								<td>
									{p.experience}
								</td>
								<td>{format(new Date(p.Requirement), 'dd MMM yyyy')}</td>
								<td>{p.location}</td>
								<td>{p.Role}</td>
								<td>{getMRFStatus(p.current_order_status)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default CandidateList
