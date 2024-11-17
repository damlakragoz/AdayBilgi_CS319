import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchoolTourApplicationFormPage from './pages/SchoolTourApplicationFormPage';

import TourApplication from './components/TourApplications';

const App = () => {

  return (
    <div>
        <Routes>
            <Route path="/school-tour-application-form" element={<SchoolTourApplicationFormPage />} />
         </Routes>
      <TourApplication />
    </div>
  );
};

export default App;
