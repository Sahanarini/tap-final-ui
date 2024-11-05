// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchApprovers } from '../../redux/store/Store'; // Adjust the path as necessary
// import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
// import { useParams } from 'react-router-dom';

// const ApprovalTable = () => {
//   const dispatch = useDispatch();
//   const { approvers, loading, error } = useSelector((state) => ({
//     ...state,
//   }));

//   const {id} = useParams();

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedApprover, setSelectedApprover] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [employeeContacts, setEmployeeContacts] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [editedRowIndex, setEditedRowIndex] = useState(null);
//   const [mrfId, setMrfId] = useState("");
//   const [isApprovalSent, setIsApprovalSent] = useState(false); // New state for approval status

//   useEffect(() => {
//     dispatch(fetchApprovers());
//     fetchEmployees();
//     fetchWorkflowData();
//   }, [dispatch]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/employees');
//       const data = await response.json();
//       setEmployeeContacts(data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const fetchWorkflowData = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/workflow');
//       const data = await response.json();
//       const mrfIdToCheck = "1"; // Change appropriately
//       const existingWorkflow = data.workflow.find(work => work.mrfId === mrfIdToCheck);
//       setMrfId(existingWorkflow ? mrfIdToCheck : null);
//     } catch (error) {
//       console.error('Error fetching workflow:', error);
//     }
//   };

//   const handleAddClick = () => {
//     setIsAddModalOpen(true);
//   };

//   const handleCloseAddModal = () => {
//     setIsAddModalOpen(false);
//     setSelectedApprover('');
//     setSearchTerm('');
//   };

//   const handleEditClick = (index) => {
//     setEditedRowIndex(index);
//     setSelectedApprover(rows[index].employee.id);
//     setSearchTerm(employeeContacts.find(emp => emp.id === rows[index].employee.id)?.name || '');
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedApprover('');
//     setEditedRowIndex(null);
//     setSearchTerm('');
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSubmit = async () => {
//     const approverDetails = employeeContacts.find(emp => emp.id === selectedApprover);
//     if (approverDetails) {
//       const newRow = {
//         level: rows.length + 1,
//         employee: {
//           id: selectedApprover
//         },
//         mrf: {
//           id: mrfId || (rows.length + 1)
//         }
//         // status is not set here; it will be set on sending for approval
//       };
//       setRows([...rows, newRow]);
//       handleCloseAddModal();
//     }
//   };

//   const handleUpdate = () => {
//     const updatedRows = [...rows];
//     const approverDetails = employeeContacts.find(emp => emp.id === selectedApprover);
//     if (approverDetails) {
//       updatedRows[editedRowIndex] = {
//         ...updatedRows[editedRowIndex],
//         employee: {
//           id: selectedApprover
//         }
//       };
//       setRows(updatedRows);
//       handleCloseEditModal();
//     }
//   };

//   const handleDelete = (index) => {
//     const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
//     const reorderedRows = updatedRows.map((row, idx) => ({ ...row, level: idx + 1 }));
//     setRows(reorderedRows);
//   };

//   const handleSendForApproval = async () => {
//     try {
//       const dataToSend = rows.map(row => ({
//         level: row.level,
//         employeeId: row.employee.id,
//         mrfId: row.mrf.id,
//       }));

//       const response = await fetch('http://localhost:4000/approvers', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save the approvers');
//       }

//       alert('All approvers have been sent for approval!');
      
//       // Set status to pending after sending for approval
//       const updatedRows = rows.map((row) => ({
//         ...row,
//         status: 'pending', // Set status to 'pending'
//       }));
//       setRows(updatedRows);

//       setIsApprovalSent(true); // Set approval status to true
//     } catch (error) {
//       console.error('Error sending for approval:', error);
//     }
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;
//   if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

//   const filteredEmployees = employeeContacts.filter(employee =>
//     employee.name.toLowerCase().startsWith(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-6 bg-gray-50 mt-24">
//       {/* <Navbar5 /> */}

//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">Approval Table</h2>
//         <button
//           onClick={handleAddClick}
//           disabled={isApprovalSent} // Disable if approval has been sent
//           className={`flex items-center ${isApprovalSent ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'} px-4 py-2 rounded-lg transition-all`}>
//           <FaPlus className="mr-2" /> Add Approver
//         </button>
//       </div>

//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="py-2 px-4 border-b">Approval Level</th>
//               <th className="py-2 px-4 border-b">Approver Name</th>
//               <th className="py-2 px-4 border-b">Contact</th>
//               <th className="py-2 px-4 border-b">Status</th> {/* New column for status */}
//               <th className="py-2 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.length > 0 ? (
//               rows.map((row, index) => (
//                 <tr key={index} className="hover:bg-gray-100">
//                   <td className="py-2 px-4 border-b">{row.level}</td>
//                   <td className="py-2 px-4 border-b">
//                     {employeeContacts.find(emp => emp.id === row.employee.id)
//                       ? `${employeeContacts.find(emp => emp.id === row.employee.id).name} (${employeeContacts.find(emp => emp.id === row.employee.id).role})`
//                       : 'Unknown'}
//                   </td>
//                   <td className="py-2 px-4 border-b">{employeeContacts.find(emp => emp.id === row.employee.id)?.contact}</td>
//                   <td className="py-2 px-4 border-b">{row.status || '-'}</td> {/* Display status */}
//                   <td className="py-2 px-4 border-b flex items-center space-x-2">
//                     <button
//                       onClick={() => handleEditClick(index)}
//                       disabled={isApprovalSent} // Disable if approval has been sent
//                       className={`bg-yellow-500 text-white px-2 py-1 rounded flex items-center ${isApprovalSent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}`}>
//                       <FaEdit className="mr-1" /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(index)}
//                       disabled={isApprovalSent} // Disable if approval has been sent
//                       className={`bg-red-500 text-white px-2 py-1 rounded flex items-center ${isApprovalSent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}>
//                       <FaTrash className="mr-1" /> Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="py-2 text-center">No entries found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-center mt-4">
//         <button
//           onClick={handleSendForApproval}
//           disabled={rows.length === 0 || isApprovalSent} // Disable if no approval levels exist or approval has been sent
//           className={`bg-green-500 ${rows.length === 0 || isApprovalSent ? 'opacity-50 cursor-not-allowed' : 'text-white hover:bg-green-600'} px-4 py-2 rounded-lg transition-all`}
//         >
//           Send for Approval
//         </button>
//       </div>

//       {/* Modal for Adding Approval */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 transition-transform transform scale-100">
//             <h2 className="text-lg font-bold mb-4">Add Approver</h2>
//             <div className="mb-4">
//               <label className="block mb-1">Approval Level</label>
//               <input
//                 type="text"
//                 value={`Level ${rows.length + 1}`}
//                 disabled
//                 className="border p-2 w-full bg-gray-100"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Approver Name</label>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 placeholder="Search for approver..."
//                 className="border p-2 w-full mb-2"
//               />
//               <div className="max-h-48 overflow-y-auto border rounded shadow-lg">
//                 {searchTerm && filteredEmployees.length > 0 && (
//                   <ul className="max-h-48">
//                     {filteredEmployees.map(employee => (
//                       <li
//                         key={employee.id}
//                         onClick={() => {
//                           setSelectedApprover(employee.id);
//                           setSearchTerm(employee.name);
//                         }}
//                         className="p-2 hover:bg-gray-200 cursor-pointer flex items-center">
//                         <img src={employee.image} alt={`${employee.name}'s profile`} className="w-8 h-8 rounded-full mr-2" />
//                         <div>
//                           <div>{employee.name}</div>
//                           <div className="text-sm text-gray-500">{employee.role}</div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//             <div className="flex justify-end">
//               <button
//                 onClick={handleCloseAddModal}
//                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2">
//                 <FaTimes className="mr-1" /> Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//                 <FaCheck className="mr-1" /> Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal for Editing Approver */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 transition-transform transform scale-100">
//             <h2 className="text-lg font-bold mb-4">Edit Approver</h2>
//             <div className="mb-4">
//               <label className="block mb-1">Approval Level</label>
//               <input
//                 type="text"
//                 value={`Level ${rows[editedRowIndex]?.level}`}
//                 disabled
//                 className="border p-2 w-full bg-gray-100"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-1">Approver Name</label>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 placeholder="Search for approver..."
//                 className="border p-2 w-full mb-2"
//               />
//               <div className="max-h-48 overflow-y-auto border rounded shadow-lg">
//                 {searchTerm && filteredEmployees.length > 0 && (
//                   <ul className="max-h-48">
//                     {filteredEmployees.map(employee => (
//                       <li
//                         key={employee.id}
//                         onClick={() => {
//                           setSelectedApprover(employee.id);
//                           setSearchTerm(employee.name);
//                         }}
//                         className="p-2 hover:bg-gray-200 cursor-pointer flex items-center">
//                         <img src={employee.image} alt={`${employee.name}'s profile`} className="w-8 h-8 rounded-full mr-2" />
//                         <div>
//                           <div>{employee.name}</div>
//                           <div className="text-sm text-gray-500">{employee.role}</div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//             <div className="flex justify-end">
//               <button
//                 onClick={handleCloseEditModal}
//                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2">
//                 <FaTimes className="mr-1" /> Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//                 <FaCheck className="mr-1" /> Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ApprovalTable;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
//import { fetchApprovers } from '../redux/store/Store';
import { fetchApprovers } from '../../redux/store/Store';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
 
const ApprovalTable = () => {
  const dispatch = useDispatch();
  const { approvers, loading, error } = useSelector((state) => state);
 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeContacts, setEmployeeContacts] = useState([]);
  const [rows, setRows] = useState(JSON.parse(localStorage.getItem('approvers')) || []); // Load initial data from local storage
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [isPending, setIsPending] = useState(false);
 
  useEffect(() => {
    dispatch(fetchApprovers());
    fetchEmployees();
  }, [dispatch]);
 
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:4000/employees');
      setEmployeeContacts(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
 
  useEffect(() => {
    localStorage.setItem('approvers', JSON.stringify(rows)); // Save the rows to local storage whenever they change
  }, [rows]);
 
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };
 
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedApprover('');
    setSearchTerm('');
  };
 
  const handleEditClick = (index) => {
    setEditedRowIndex(index);
    setSelectedApprover(rows[index].employee.id);
    setSearchTerm(employeeContacts.find(emp => emp.id === rows[index].employee.id)?.name || '');
    setIsEditModalOpen(true);
  };
 
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedApprover('');
    setEditedRowIndex(null);
    setSearchTerm('');
  };
 
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
 
  const handleSubmit = async () => {
    const approverDetails = employeeContacts.find(emp => emp.id === selectedApprover);
    if (approverDetails) {
      const newRow = {
        level: rows.length + 1,
        employee: {
          id: selectedApprover
        },
        mrf: {
          id: rows.length + 1
        },
        status: 'Pending'
      };
      setRows([...rows, newRow]);
      handleCloseAddModal();
    }
  };
 
  const handleUpdate = () => {
    const updatedRows = [...rows];
    const approverDetails = employeeContacts.find(emp => emp.id === selectedApprover);
    if (approverDetails) {
      updatedRows[editedRowIndex] = {
        ...updatedRows[editedRowIndex],
        employee: {
          id: selectedApprover
        }
      };
      setRows(updatedRows);
      handleCloseEditModal();
    }
  };
 
  const handleDelete = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    const reorderedRows = updatedRows.map((row, idx) => ({ ...row, level: idx + 1 }));
    setRows(reorderedRows);
  };
 
  const handleSendForApproval = async () => {
    try {
      const dataToSend = rows.map(row => ({
        mrf: {
          mrfId: 3
        },
        employee: {
          employeeId: row.employee.id,
        },
        level: row.level,
      }));
 
      const response = await axios.post('http://localhost:8080/tap/addApproverLevel', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
     
      if (!response.status === 200) {
        throw new Error('Failed to save the approvers');
      }
 
      setIsPending(true);
      alert('All approvers have been sent for approval!');
    } catch (error) {
      console.error('Error sending for approval:', error);
    }
  };
 
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;
 
  const filteredEmployees = employeeContacts.filter(employee =>
    employee.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );
 
  return (
    <div className="p-6 bg-gray-50 mt-24">
     
 
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Approval Table</h2>
        <button
          onClick={handleAddClick}
          disabled={isPending}
          className={`flex items-center ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-lg transition-all`}>
          <FaPlus className="mr-2" /> Add Approver
        </button>
      </div>
 
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Approval Level</th>
              <th className="py-2 px-4 border-b">Approver Name</th>
              <th className="py-2 px-4 border-b">Contact</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{row.level}</td>
                  <td className="py-2 px-4 border-b">
                    {employeeContacts.find(emp => emp.id === row.employee.id)
                      ? `${employeeContacts.find(emp => emp.id === row.employee.id).name} (${employeeContacts.find(emp => emp.id === row.employee.id).role})`
                      : 'Unknown'}
                  </td>
                  <td className="py-2 px-4 border-b">{employeeContacts.find(emp => emp.id === row.employee.id)?.contact}</td>
                  <td className="py-2 px-4 border-b">{row.status}</td>
                  <td className="py-2 px-4 border-b flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(index)}
                      disabled={isPending}
                      className={`bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center ${isPending ? 'cursor-not-allowed' : ''}`}>
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      disabled={isPending}
                      className={`bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center ${isPending ? 'cursor-not-allowed' : ''}`}>
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 text-center">No entries found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
 
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSendForApproval}
          disabled={rows.length === 0 || isPending}
          className={`bg-green-500 ${rows.length === 0 || isPending ? 'opacity-50 cursor-not-allowed' : 'text-white hover:bg-green-600'} px-4 py-2 rounded-lg transition-all`}
        >
          Send for Approval
        </button>
      </div>
 
      {/* Modal for Adding Approval */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 transition-transform transform scale-100">
            <h2 className="text-lg font-bold mb-4">Add Approver</h2>
            <div className="mb-4">
              <label className="block mb-1">Approval Level</label>
              <input
                type="text"
                value={`Level ${rows.length + 1}`}
                disabled
                className="border p-2 w-full bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Approver Name</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for approver..."
                className="border p-2 w-full mb-2"
              />
              <div className="max-h-48 overflow-y-auto border rounded shadow-lg">
                {searchTerm && filteredEmployees.length > 0 && (
                  <ul className="max-h-48">
                    {filteredEmployees.map(employee => (
                      <li
                        key={employee.id}
                        onClick={() => {
                          setSelectedApprover(employee.id);
                          setSearchTerm(employee.name);
                        }}
                        className="p-2 hover:bg-gray-200 cursor-pointer flex items-center">
                        <img src={employee.image} alt={`${employee.name}'s profile`} className="w-8 h-8 rounded-full mr-2" />
                        <div>
                          <div>{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.role}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseAddModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2">
                <FaTimes className="mr-1" /> Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                <FaCheck className="mr-1" /> Submit
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Modal for Editing Approver */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 transition-transform transform scale-100">
            <h2 className="text-lg font-bold mb-4">Edit Approver</h2>
            <div className="mb-4">
              <label className="block mb-1">Approval Level</label>
              <input
                type="text"
                value={`Level ${rows[editedRowIndex]?.level}`}
                disabled
                className="border p-2 w-full bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Approver Name</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for approver..."
                className="border p-2 w-full mb-2"
              />
              <div className="max-h-48 overflow-y-auto border rounded shadow-lg">
                {searchTerm && filteredEmployees.length > 0 && (
                  <ul className="max-h-48">
                    {filteredEmployees.map(employee => (
                      <li
                        key={employee.id}
                        onClick={() => {
                          setSelectedApprover(employee.id);
                          setSearchTerm(employee.name);
                        }}
                        className="p-2 hover:bg-gray-200 cursor-pointer flex items-center">
                        <img src={employee.image} alt={`${employee.name}'s profile`} className="w-8 h-8 rounded-full mr-2" />
                        <div>
                          <div>{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.role}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseEditModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2">
                <FaTimes className="mr-1" /> Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                <FaCheck className="mr-1" /> Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ApprovalTable;
