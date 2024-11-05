import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import Navbar from '../components/Navbar';
//import Footer from '../components/Footer';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
//import Modal from '../components/Modal'; // Create a generic Modal component
import Modal from '../components/Recruiter/Modal';

const AssessmentSchedulingPage = () => {
    const { mrfid } = useParams();
    const [assessments, setAssessments] = useState([]);
    const [mrfCandidates, setMrfCandidates] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [selectedAssessedCandidates, setSelectedAssessedCandidates] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectAllAssessed, setSelectAllAssessed] = useState(false);
    const [showAllAssessments, setShowAllAssessments] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentAssessment, setCurrentAssessment] = useState(null);
    const [activeTab, setActiveTab] = useState('available');
    const [scheduleDetails, setScheduleDetails] = useState({
        assessmentName: '',
        assessmentLink: '',
        assessmentType: '',
        assessmentStartDate: '',
        recruitmentProcess: '',
        assessmentEndDate: '',
        assessmentStartTime: '',
        assessmentEndTime: ''
    });

    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [assessmentsResponse, mrfCandidatesResponse, scoresResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/tap/recruiter/assessment/getassessment/${mrfid}`),//${id}
                    axios.get(`http://localhost:8080/mrfCandidates/remainingcandidate/${mrfid}`),//${id}
                    axios.get(`http://localhost:8080/scores/getcandidates/${mrfid}`)//${id}
                ]);
                setAssessments(assessmentsResponse.data);
                setMrfCandidates(mrfCandidatesResponse.data);
                setScores(scoresResponse.data);
            } catch (error) {
                console.error('Error fetching data!', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCheckboxChange = (candidateId) => {
        setSelectedCandidates(prevSelected => {
            if (prevSelected.includes(candidateId)) {
                return prevSelected.filter(id => id !== candidateId);
            } else {
                return [...prevSelected, candidateId];
            }
        });
    };

    const handleCheckboxChangeScore = (scoreId) => {
        setSelectedAssessedCandidates(prevSelected => {
            if (prevSelected.includes(scoreId)) {
                return prevSelected.filter(id => id !== scoreId);
            } else {
                return [...prevSelected, scoreId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedCandidates([]);
        } else {
            setSelectedCandidates(mrfCandidates.map(mrfCandidate => mrfCandidate.candidateId));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectAllAssessed = () => {
        if (selectAllAssessed) {
            setSelectedAssessedCandidates([]);
        } else {
            setSelectedAssessedCandidates(scores.map(score => score.scoreId));
        }
        setSelectAllAssessed(!selectAllAssessed);
    };

    const handleShowScheduleModal = () => {
        if (assessments.length > 0) {
            const assessment = assessments[0];
            setScheduleDetails({
                recruitmentProcess: assessment.recruitmentProcess,
                assessmentName: assessment.assessmentName,
                assessmentLink: assessment.assessmentLink,
                assessmentType: assessment.assessmentType,
                assessmentStartDate: assessment.assessmentStartDate,
                assessmentEndDate: assessment.assessmentEndDate,
                assessmentStartTime: assessment.assessmentStartTime,
                assessmentEndTime: assessment.assessmentEndTime
            });
        }
        setShowScheduleModal(true);
    };

    const handleSaveAndSchedule = async () => {
        setIsLoading(true);
        try {
            const assessmentResponse = await axios.post(`http://localhost:8080/tap/recruiter/assessment/save`, scheduleDetails);
            const assessmentId = assessmentResponse.data.assessmentId;

            const requests = selectedCandidates.map(candidateId => {
                return axios.post(`http://localhost:8080/scores/post`, {
                    assessment: { assessmentId: assessmentId },
                    candidateId: { candidateId: candidateId },
                    status: "Pending"
                });
            });

            await Promise.all(requests);

            const selectedCandidateEmails = mrfCandidates
                .filter(candidate => selectedCandidates.includes(candidate.candidateId))
                .map(candidate => candidate.email);

            await axios.post(`http://localhost:8080/schedule/post`, {
                assessmentName: assessmentResponse.data.assessmentName,
                assessmentLink: assessmentResponse.data.assessmentLink,
                assessmentType: assessmentResponse.data.assessmentType,
                candidateEmails: selectedCandidateEmails,
                assessmentStartDate: assessmentResponse.data.assessmentStartDate,
                assessmentEndDate: assessmentResponse.data.assessmentEndDate,
                assessmentStartTime: assessmentResponse.data.assessmentStartTime,
                assessmentEndTime: assessmentResponse.data.assessmentEndTime
            });
            setShowSuccessModal(true);
        } catch (error) {
            setErrorMessage('Error scheduling the assessment and saving scores!');
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
            setShowScheduleModal(false);
        }
    };

    const handleUpdateClick = (assessment) => {
        setCurrentAssessment(assessment);
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await axios.put(`http://localhost:8080/tap/recruiter/assessment/update/${currentAssessment.assessmentId}`, currentAssessment);
            setShowSuccessModal(true);
            setShowUpdateModal(false);
        } catch (error) {
            setErrorMessage('Error updating the assessment!');
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentAssessment(prev => ({ ...prev, [name]: value }));
    };

    const renderAvailableCandidates = () => (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-blue-600">Available Candidates</h3>
                <button
                    onClick={handleShowScheduleModal}
                    disabled={selectedCandidates.length === 0}
                    className={`bg-blue-600 text-white px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-blue-700
                    ${selectedCandidates.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FaCheckCircle className="inline-block mr-1" /> Schedule
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="mr-2"
                />
                <label className="font-semibold">Select All</label>
            </div>
            {mrfCandidates.map(cand => (
                <div key={cand.candidateId} className="flex items-center mb-2 p-2 border-b hover:bg-gray-100 transition duration-200 ease-in-out">
                    <input
                        type="checkbox"
                        checked={selectedCandidates.includes(cand.candidateId)}
                        onChange={() => handleCheckboxChange(cand.candidateId)}
                        className="mr-2"
                    />
                    <label className="ml-2">{cand.firstName} {cand.lastName} - {cand.email}</label>
                    <span className="ml-auto text-sm text-gray-600">{cand.resume} - {cand.skill} - {cand.experience} years</span>
                </div>
            ))}
        </div>
    );

    const renderAssessedCandidates = () => (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-green-600">Assessed Candidates</h3>
                <button
                    onClick={() => console.log('Moving to next step.')}
                    disabled={selectedAssessedCandidates.length === 0}
                    className={`bg-green-600 text-white px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-green-700
                    ${selectedAssessedCandidates.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Move Next
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="checkbox"
                    checked={selectAllAssessed}
                    onChange={handleSelectAllAssessed}
                    className="mr-2"
                />
                <label className="font-semibold">Select All Assessed</label>
            </div>
            {scores.map(score => (
                <div key={score.scoreId} className="flex items-center mb-2 p-2 border-b">
                    <input
                        type="checkbox"
                        checked={selectedAssessedCandidates.includes(score.scoreId)}
                        onChange={() => handleCheckboxChangeScore(score.scoreId)}
                        className="mr-2"
                    />
                    <label className="ml-2">{score.candidateId.firstName} {score.candidateId.lastName}</label>
                    <span className="ml-auto">Scores: {score.score} - Remarks: {score.remarks} Status: ({score.status})</span>
                </div>
            ))}


        </div>
    );

    const renderTabContent = () => {
        if (activeTab === 'available') {
            return renderAvailableCandidates();
        } else {
            return renderAssessedCandidates();
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* <Navbar /> */}
            <div className="container mx-auto p-8">
                {isLoading && <div className="flex justify-center"><FaSpinner className="animate-spin text-blue-600" size={40} /></div>}
                {assessments.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                        <h2 className="text-2xl font-bold text-blue-600">Level: {assessments[0].recruitmentProcess.level}</h2>
                        <p className="text-gray-700">Type: {assessments[0].assessmentType}</p>
                        <p className="text-gray-700">Link: <a href={assessments[0].assessmentLink} className="text-blue-500 underline">{assessments[0].assessmentLink}</a></p>
                        <p className="text-gray-700">Name: {assessments[0].assessmentName}</p>
                        <p className="text-gray-700">Start Date: {assessments[0].assessmentStartDate}</p>
                        <p className="text-gray-700">End Date: {assessments[0].assessmentEndDate}</p>
                        <p className="text-gray-700">Start Time: {assessments[0].assessmentStartTime}</p>
                        <p className="text-gray-700">End Time: {assessments[0].assessmentEndTime}</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2 transition duration-200 ease-in-out hover:bg-blue-700"
                            onClick={() => handleUpdateClick(assessments[0])}><FaCheckCircle className="inline-block"/> Update</button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2 transition duration-200 ease-in-out hover:bg-gray-600"
                            onClick={() => setShowAllAssessments(!showAllAssessments)}>
                            {showAllAssessments ? <FaTimesCircle className="inline-block"/> : 'Show All Assessments'}
                        </button>
                    </div>
                )}
                {showAllAssessments && assessments.slice(1).map(assessment => (
                    <div key={assessment.assessmentId} className="bg-white rounded-lg shadow-lg p-6 mb-4">
                        <h2 className="text-xl font-bold text-blue-600">Level: {assessment.recruitmentProcess.level}</h2>
                        <p className="text-gray-700">Type: {assessment.assessmentType}</p>
                        <p className="text-gray-700">Link: {assessment.assessmentLink}</p>
                        <p className="text-gray-700">Name: {assessment.assessmentName}</p>
                        <p className="text-gray-700">Start Date: {assessment.assessmentStartDate}</p>
                        <p className="text-gray-700">End Date: {assessment.assessmentEndDate}</p>
                        <p className="text-gray-700">Start Time: {assessment.assessmentStartTime}</p>
                        <p className="text-gray-700">End Time: {assessment.assessmentEndTime}</p>
                    </div>
                ))}
            </div>
            <div className="container mx-auto p-6">
                <div className="flex space-x-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded transition duration-200 ease-in-out ${activeTab === 'available' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('available')}
                    >
                        Available
                    </button>
                    <button
                        className={`px-4 py-2 rounded transition duration-200 ease-in-out ${activeTab === 'assessed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('assessed')}
                    >
                        Assessed
                    </button>
                </div>
                {renderTabContent()}
            </div>

            {/* Schedule Modal */}
            {showScheduleModal && (
                <Modal onClose={() => setShowScheduleModal(false)} width="max-w-2xl">
                    <h2 className="text-xl font-bold mb-4">Schedule Assessment</h2>
                    <form>
                        <div className="grid grid-cols-2 gap-4">
                            {['assessmentName', 'assessmentLink', 'assessmentType', 'assessmentStartDate', 'assessmentEndDate', 'assessmentStartTime', 'assessmentEndTime'].map((field, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="mb-1">{field.replace(/([A-Z])/g, ' $1')}: </label>
                                    <input 
                                        type={field.includes('Date') ? 'date' : field.includes('Time') ? 'time' : 'text'}
                                        name={field} 
                                        value={scheduleDetails[field]} 
                                        onChange={(e) => setScheduleDetails({ ...scheduleDetails, [field]: e.target.value })} 
                                        className="border rounded p-2"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded mr-2 transition duration-200 ease-in-out hover:bg-blue-700" onClick={handleSaveAndSchedule}>
                                <FaCheckCircle className="inline-block"/> Save & Schedule
                            </button>
                            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-gray-600" onClick={() => setShowScheduleModal(false)}>
                                <FaTimesCircle className="inline-block"/> Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Update Modal */}
            {showUpdateModal && (
                <Modal onClose={() => setShowUpdateModal(false)} width="max-w-2xl">
                    <h2 className="text-xl font-bold mb-4">Update Assessment</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            {['assessmentName', 'assessmentLink', 'assessmentType', 'assessmentStartDate', 'assessmentEndDate', 'assessmentStartTime', 'assessmentEndTime'].map((field, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="mb-1">{field.replace(/([A-Z])/g, ' $1')}: </label>
                                    <input 
                                        type={field.includes('Date') ? 'date' : field.includes('Time') ? 'time' : 'text'} 
                                        name={field} 
                                        value={currentAssessment[field]} 
                                        onChange={handleInputChange} 
                                        className="border rounded p-2" 
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2 transition duration-200 ease-in-out hover:bg-blue-700">
                                <FaCheckCircle className="inline-block"/> Save
                            </button>
                            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-gray-600" onClick={() => setShowUpdateModal(false)}>
                                <FaTimesCircle className="inline-block"/> Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Success and Error Modals */}
            {showSuccessModal && (
                <Modal onClose={() => setShowSuccessModal(false)} success width="max-w-md">
                    <h2 className="text-xl font-bold mb-4">Success</h2>
                    <p>Action completed successfully!</p>
                    <div className="flex justify-end mt-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowSuccessModal(false)}>Close</button>
                    </div>
                </Modal>
            )}
            {showErrorModal && (
                <Modal onClose={() => setShowErrorModal(false)} error width="max-w-md">
                    <h2 className="text-xl font-bold mb-4">Error</h2>
                    <p>{errorMessage}</p>
                    <div className="flex justify-end mt-4">
                        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => setShowErrorModal(false)}>Close</button>
                    </div>
                </Modal>
            )}

            {/* <Footer /> */}
        </div>
    );
};

export default AssessmentSchedulingPage;
