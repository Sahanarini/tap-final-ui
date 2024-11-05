import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert

const LevelCards = () => {
    const navigate = useNavigate();
    const { mrfid } = useParams();

    const [rpls, setRpls] = useState({
        recruiterManagerId: 1,
        recruitmentProcesses: [],
    });

    const [employees, setEmployees] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [assessmentType, setAssessmentType] = useState('');
    const [interviewName, setInterviewName] = useState('');
    const [interviewers, setInterviewers] = useState(['']);
    const [editLevelNumber, setEditLevelNumber] = useState(null);
    const [workflowStatus, setWorkflowStatus] = useState('');
    const [addedLevels, setAddedLevels] = useState([]);

    const fetchWorkflowStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/tap/getWorkflowByMrfIdForRecruitmentProcess/1`);
            setWorkflowStatus(response.data ? response.data.status : '');
        } catch (error) {
            console.error("Failed to fetch workflow status:", error);
        }
    };

    const fetchRecruitmentProcesses = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/tap/getRecruitmentProcessLevels/1`);
            if (response.data) {
                setRpls(prevRpls => ({ ...prevRpls, recruitmentProcesses: response.data }));
                setAddedLevels(response.data.map(level => ({
                    level: level.level,
                    recruitmentProcessType: level.recruitmentProcessType,
                    recruitmentProcessName: level.recruitmentProcessName,
                    interviewerIds: level.interviewer.map(interviewer => interviewer.employee.employeeId)
                })));
            }
        } catch (error) {
            console.error("Failed to fetch recruitment processes:", error);
        }
    };

    const fetchAllEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8080/tap/getAllEmployee');
            if (response.data) {
                setEmployees(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch employee details", error);
        }
    };

    useEffect(() => {
        fetchWorkflowStatus();
        fetchRecruitmentProcesses();
        fetchAllEmployees();
    }, []);

    const addLevel = () => {
        setOpenModal(true);
        resetModalFields();
    };

    const resetModalFields = () => {
        setSelectedType('');
        setAssessmentType('');
        setInterviewName('');
        setInterviewers(['']);
    };

    const handleEdit = (level) => {
        setEditLevelNumber(level.level);
        setSelectedType(level.recruitmentProcessType);
        if (level.recruitmentProcessType === 'Assessment') {
            setAssessmentType(level.recruitmentProcessName);
            setInterviewName('');
            setInterviewers(['']);
        } else {
            setInterviewName(level.recruitmentProcessName);
            setAssessmentType('');
            setInterviewers(level.interviewer.map(interviewer => interviewer.employee.employeeId));
        }
        setOpenEditModal(true);
    };

    const handleDelete = async (level) => {
        if (workflowStatus === 'approved' || workflowStatus === 'rejected') {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/tap/deleteRecruitmentProcessLevel/${level.recruitmentProcessId}`);
                    Swal.fire('Deleted!', 'Level has been deleted.', 'success');
                    setRpls(prevRpls => ({
                        ...prevRpls,
                        recruitmentProcesses: prevRpls.recruitmentProcesses.filter(l => l.recruitmentProcessId !== level.recruitmentProcessId),
                    }));
                    setAddedLevels(prevLevels => prevLevels.filter(l => l.level !== level.level));
                } catch (error) {
                    console.error("Failed to delete level from database:", error);
                    Swal.fire('Error!', 'There was an error deleting the level.', 'error');
                }
            }
        } else {
            Swal.fire('Info!', 'Levels can only be deleted when workflow status is approved or rejected.', 'info');
        }
    };

    const handleRadioChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleSaveDetails = async () => {
        const newLevel = {
            level: rpls.recruitmentProcesses.length + 1,
            mrf: { mrfId: 1 },
            recruitmentProcessType: selectedType,
            recruitmentProcessName: selectedType === 'Assessment' ? assessmentType : interviewName,
            interviewer: selectedType === 'Interview'
                ? interviewers.map(emp => ({ employee: { employeeId: emp }, status: 'Pending' }))
                : [],
            completedStatus: 'Pending',
        };

        if (workflowStatus === 'approved' || workflowStatus === 'rejected') {
            try {
                await axios.post('http://localhost:8080/tap/insertRecruitmentProcessLevel', newLevel);
                Swal.fire('Success!', 'Level saved successfully!', 'success');
            } catch (error) {
                console.error("Failed to save level to the database:", error);
                Swal.fire('Error!', 'Error while saving to the database.', 'error');
            }
        } else {
            setRpls(prevRpls => ({
                ...prevRpls,
                recruitmentProcesses: [...prevRpls.recruitmentProcesses, newLevel]
            }));

            setAddedLevels(prevLevels => {
                const levelDetails = {
                    level: newLevel.level,
                    recruitmentProcessType: newLevel.recruitmentProcessType,
                    recruitmentProcessName: newLevel.recruitmentProcessName,
                };

                if (selectedType === 'Interview') {
                    levelDetails.interviewerIds = newLevel.interviewer.map(interviewer => interviewer.employee.employeeId);
                }

                return [...prevLevels, levelDetails];
            });
            Swal.fire('Success!', 'Level saved successfully!', 'success');
        }

        setOpenModal(false);
        setSnackbarOpen(true);
    };
    const handleUpdateDetails = async () => {
        const updatedLevel = {
            level: editLevelNumber,
            mrf: { mrfId: 1 },
            recruitmentProcessType: selectedType,
            recruitmentProcessName: selectedType === 'Assessment' ? assessmentType : interviewName,
            interviewer: selectedType === 'Interview'
                ? interviewers.map(emp => ({ employee: { employeeId: emp }, status: 'Pending' }))
                : [],
            completedStatus: 'Pending',
        };
    
        // Check for duplicates only if the name changes
        const isDuplicate = rpls.recruitmentProcesses.some(level => 
            level.recruitmentProcessName === updatedLevel.recruitmentProcessName &&
            level.level !== editLevelNumber // Ensure it’s not the same level
        );
    
        if (isDuplicate) {
            Swal.fire('Error!', 'A level with this name already exists!', 'error');
            return; // Stop execution if a duplicate is found
        }
    
        setRpls(prevRpls => ({
            ...prevRpls,
            recruitmentProcesses: prevRpls.recruitmentProcesses.map(level => 
                (level.level === editLevelNumber ? updatedLevel : level)
            )
        }));
    
        try {
            await axios.put(`http://localhost:8080/tap/updateRecruitmentProcessLevel`, updatedLevel);
            Swal.fire('Success!', 'Level updated successfully!', 'success');
        } catch (error) {
            console.error("Failed to update level:", error);
            Swal.fire('Error!', 'Failed to update level.', 'error');
        }
    
        setAddedLevels(prevLevels => {
            return prevLevels.map(level => {
                if (level.level === editLevelNumber) {
                    return {
                        level: updatedLevel.level,
                        recruitmentProcessType: updatedLevel.recruitmentProcessType,
                        recruitmentProcessName: updatedLevel.recruitmentProcessName,
                        interviewerIds: updatedLevel.interviewer?.map(interviewer => interviewer.employee.employeeId) || []
                    };
                }
                return level;
            });
        });
    
        setOpenEditModal(false);
        setSnackbarOpen(true);
    };
    const handleAddEmployee = () => {
        setInterviewers([...interviewers, '']);
    };

    const handleEmployeeChange = (index, value) => {
        const updatedEmployees = [...interviewers];
        updatedEmployees[index] = value;
        setInterviewers(updatedEmployees);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const sendForApproval = async () => {
        const count = rpls.recruitmentProcesses.length;
        const recruitmentManagerId = rpls.recruiterManagerId;

        const workflowData = {
            workflow: [
                {
                    count: count,
                    recruiterManagerId: recruitmentManagerId,
                    status: 'Pending',
                },
            ],
        };

        try {
            await axios.post('http://localhost:8080/tap/addRecruitmentProcess', rpls);
            Swal.fire('Success!', 'Levels sent for approval successfully!', 'success');
            fetchWorkflowStatus(); // Fetch updated status
        } catch (error) {
            console.error("Failed to send for approval:", error);
            Swal.fire('Error!', 'Failed to send for approval.', 'error');
        }
    };

    const isWorkflowPending = workflowStatus === 'Pending';

    // Function to handle the card click
    const handleCardClick = (level) => {
        // Allow navigation to the Assessment Scheduling Page if it is an Assessment
        if (level.recruitmentProcessType === 'Assessment') {
            navigate(`AssessmentSchedulingPage/${mrfid}`);
            return;
        }
        
        // Prevent navigation if status is not approved for other recruitment types
        if (workflowStatus !== 'Approved' && level.recruitmentProcessType !== 'Assessment') {
            return;  
        }
        
        navigate(`AssessmentSchedulingPage/${mrfid}`); // This line is probably not needed anymore due to the previous one
    };

    return (
        <div className="w-full p-6 bg-gray-50">
            <div className="mb-4">
                <div className="flex justify-between items-center">
                    <button
                        className={`text-white bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition duration-200 ${isWorkflowPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={addLevel}
                        disabled={isWorkflowPending}
                    >
                        Add Level
                    </button>
                </div>
            </div>

            {/* Pending Status Message */}
            {isWorkflowPending && (
                <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500">
                    <p className="font-semibold">Pending: Actions cannot be performed while the workflow status is pending.</p>
                </div>
            )}

            {/* Display grey box if no levels have been added */}
            {rpls.recruitmentProcesses.length === 0 && (
                <div className="mb-4 p-4 bg-gray-200 text-gray-600 italic rounded">
                    Not yet updated: No levels have been added.
                </div>
            )}

            {/* <div className="overflow-x-auto mb-4">
                <div className="flex items-center justify-start w-full flex-wrap">
                    {rpls.recruitmentProcesses.map((level, index) => (
                        <React.Fragment key={level.level}>
                            {index > 0 && (
                                <span className="text-2xl text-blue-600 self-center mx-2">→</span>
                            )}
                            <div
                                className={`flex-none rounded-lg shadow-md bg-white mr-2 p-6 mb-4 w-full max-w-xs transform transition-transform hover:shadow-lg hover:scale-105 ${level.recruitmentProcessType === 'Assessment' ? 'cursor-pointer' : ''}`}
                                onClick={() => handleCardClick(level)}
                            >
                                <h2 className="font-bold text-xl text-gray-800">Level {level.level}</h2>
                                <p className="font-bold text-blue-600">Type: {level.recruitmentProcessType}</p>
                                <p className="text-gray-700">
                                    <strong>{level.recruitmentProcessType === 'Assessment' ? 'Assessment Name:' : 'Interview Name:'}</strong> {level.recruitmentProcessName}
                                </p>
                                <div className="flex mt-3 space-x-3">
                                    <span
                                        className={`bg-green-600 text-white cursor-pointer hover:bg-green-700 p-2 rounded transition duration-200 ${isWorkflowPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => !isWorkflowPending && handleEdit(level)} // Disable the click if the workflow is pending
                                    >
                                        Edit
                                    </span>
                                    <span
                                        className={`bg-red-600 text-white cursor-pointer hover:bg-red-700 p-2 rounded transition duration-200 ${isWorkflowPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => !isWorkflowPending && handleDelete(level)} // Disable the click if the workflow is pending
                                    >
                                        Delete
                                    </span>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div> */}
<div className="overflow-x-auto mb-4">
    <div className="flex items-center justify-start w-full flex-wrap">
        {rpls.recruitmentProcesses.map((level, index) => (
            <React.Fragment key={level.level}>
                {index > 0 && (
                    <span className="text-2xl text-blue-600 self-center mx-2">→</span>
                )}
                <div
                    className={`flex-none rounded-lg shadow-md bg-white mr-2 p-6 mb-4 w-full max-w-xs transform transition-transform hover:shadow-lg hover:scale-105 ${level.recruitmentProcessType === 'Assessment' ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                        // Only navigate if status is approved for non-assessment levels
                        if (level.recruitmentProcessType === 'Assessment') {
                            navigate(`AssessmentSchedulingPage/${mrfid}`);
                        }
                    }}
                >
                    <h2 className="font-bold text-xl text-gray-800">Level {level.level}</h2>
                    <p className="font-bold text-blue-600">Type: {level.recruitmentProcessType}</p>
                    <p className="text-gray-700">
                        <strong>{level.recruitmentProcessType === 'Assessment' ? 'Assessment Name:' : 'Interview Name:'}</strong> {level.recruitmentProcessName}
                    </p>
                    <div className="flex mt-3 space-x-3">
                        <span
                            className={`bg-green-600 text-white cursor-pointer hover:bg-green-700 p-2 rounded transition duration-200 ${isWorkflowPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click when editing
                                handleEdit(level);
                            }} // Call edit function directly
                        >
                            Edit
                        </span>
                        <span
                            className={`bg-red-600 text-white cursor-pointer hover:bg-red-700 p-2 rounded transition duration-200 ${isWorkflowPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click when deleting
                                handleDelete(level);
                            }} // Call delete function directly
                        >
                            Delete
                        </span>
                    </div>
                </div>
            </React.Fragment>
        ))}
    </div>
</div>
            <div className="mt-8 flex flex-col items-center">
                {/* Always show added levels if they exist */}
                {addedLevels.length > 0 && addedLevels.map((addedLevel) => (
                    <div
                        key={addedLevel.level}
                        className="flex-none rounded-lg shadow-md bg-blue-600 text-white p-4 m-4 w-full max-w-md cursor-pointer"
                        onClick={() => handleCardClick(addedLevel)} // Call handleCardClick on click
                    >
                        <p><strong>Level:</strong> {addedLevel.level}</p>
                        <p><strong>Type:</strong> {addedLevel.recruitmentProcessType}</p>
                        <p><strong>Name:</strong> {addedLevel.recruitmentProcessName}</p>
                        {addedLevel.recruitmentProcessType === 'Interview' && (
                            <p><strong>Interviewers:</strong> {addedLevel.interviewerIds.length > 0 ? addedLevel.interviewerIds.join(', ') : 'No Interviewers Assigned'}</p>
                        )}
                        {addedLevel.recruitmentProcessType === 'Assessment' && (
                            <p><strong>Assessment Name:</strong> {addedLevel.recruitmentProcessName}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Send for Approval button */}
            {rpls.recruitmentProcesses.length > 0 && (
                <div className="mt-4">
                    <button
                        className={`text-white bg-green-600 hover:bg-green-700 p-3 rounded-lg transition duration-200 ${workflowStatus === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={sendForApproval}
                        disabled={workflowStatus === 'Pending'}
                    >
                        Send for Approval
                    </button>
                </div>
            )}

            {/* Add Level Modal */}
            <div className={`fixed inset-0 flex items-center justify-center ${openModal ? 'block' : 'hidden'}`}>
                <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
                    <h2 className="mb-4 text-lg font-semibold">Select Assessment or Interview</h2>
                    <div>
                        <label className="block mb-2">
                            <input
                                type="radio"
                                value="Assessment"
                                checked={selectedType === 'Assessment'}
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Assessment
                        </label>
                        <label className="block mb-2">
                            <input
                                type="radio"
                                value="Interview"
                                checked={selectedType === 'Interview'}
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Interview
                        </label>
                    </div>

                    {selectedType === 'Assessment' && (
                        <input
                            type="text"
                            placeholder="Assessment Name"
                            value={assessmentType}
                            onChange={(e) => setAssessmentType(e.target.value)}
                            className="mb-4 w-full p-2 border border-gray-300 rounded"
                        />
                    )}

                    {selectedType === 'Interview' && (
                        <>
                            <input
                                type="text"
                                placeholder="Interview Name"
                                value={interviewName}
                                onChange={(e) => setInterviewName(e.target.value)}
                                className="mb-4 w-full p-2 border border-gray-300 rounded"
                            />
                            <p className="font-semibold mb-2">Interviewers:</p>
                            {interviewers.map((emp, index) => (
                                <select
                                    key={index}
                                    value={emp}
                                    onChange={(e) => handleEmployeeChange(index, e.target.value)}
                                    className="mb-4 w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(({ employee }) => (
                                        <option key={employee.employeeId} value={employee.employeeId}>
                                            {employee.personalInfo.employeeFirstName + ' ' + employee.personalInfo.employeeLastName}
                                        </option>
                                    ))}
                                </select>
                            ))}
                            <button onClick={handleAddEmployee} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500">
                                Add Employee
                            </button>
                        </>
                    )}
                    <div className="flex justify-end mt-4">
                        <button onClick={handleSaveDetails} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500">
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Level Modal */}
            <div className={`fixed inset-0 flex items-center justify-center ${openEditModal ? 'block' : 'hidden'}`}>
                <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
                    <h2 className="mb-4 text-lg font-semibold">Edit Level Details</h2>
                    <div>
                        <label className="block mb-2">
                            <input
                                type="radio"
                                value="Assessment"
                                checked={selectedType === 'Assessment'}
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Assessment
                        </label>
                        <label className="block mb-2">
                            <input
                                type="radio"
                                value="Interview"
                                checked={selectedType === 'Interview'}
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Interview
                        </label>
                    </div>

                    {selectedType === 'Assessment' && (
                        <input
                            type="text"
                            placeholder="Assessment Type"
                            value={assessmentType}
                            onChange={(e) => setAssessmentType(e.target.value)}
                            className="mb-4 w-full p-2 border border-gray-300 rounded"
                        />
                    )}

                    {selectedType === 'Interview' && (
                        <>
                            <input
                                type="text"
                                placeholder="Interview Name"
                                value={interviewName}
                                onChange={(e) => setInterviewName(e.target.value)}
                                className="mb-4 w-full p-2 border border-gray-300 rounded"
                            />
                            <p className="font-semibold mb-2">Interviewers:</p>
                            {interviewers.map((emp, index) => (
                                <select
                                    key={index}
                                    value={emp}
                                    onChange={(e) => handleEmployeeChange(index, e.target.value)}
                                    className="mb-4 w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(({ employee }) => (
                                        <option key={employee.employeeId} value={employee.employeeId}>
                                            {employee.personalInfo.employeeFirstName + ' ' + employee.personalInfo.employeeLastName}
                                        </option>
                                    ))}
                                </select>
                            ))}
                            <button onClick={handleAddEmployee} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500">
                                Add Employee
                            </button>
                        </>
                    )}
                    <div className="flex justify-end mt-4">
                        <button onClick={handleUpdateDetails} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500">
                            Update
                        </button>
                    </div>
                </div>
            </div>

            {snackbarOpen && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center transition-opacity duration-300">
                    Level saved successfully!
                    <button onClick={handleCloseSnackbar} className="ml-4 text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default LevelCards;