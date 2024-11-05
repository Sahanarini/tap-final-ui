import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApprovalLevelTableView from "../views/ApprovalLevelTableView";
import LevelcardsView from "../views/LevelcardsView";
import Dashboard from "../components/Dashboard";
import Layout from "../components/shared/Layout";
import Maindashoard from "../components/Maindashoard";
import MRFone from "../components/MRFdashboard/MRFone";
import MRFonedashboard from "../components/MRFdashboard/MRFonedashboard";
import AssessmentSchedulingPage from "../views/AssessmentSchedulingPage";


const MainRouter = () => {
  return (
    <Router>
     
      <Routes>
        <Route path="/" element={<Maindashoard />} />
          <Route path="lay" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
        
        <Route path="/mrfone/:mrfid" element={<MRFone />} >
          <Route index element={<MRFonedashboard />} />
          <Route path="approver" element={<ApprovalLevelTableView />} />
          <Route path="level" element={<LevelcardsView />} />
          <Route path="AssessmentSchedulingPage/:mrfid" element={<AssessmentSchedulingPage />} />
        </Route>
      </Routes>


    </Router>
  );
};

export default MainRouter;


