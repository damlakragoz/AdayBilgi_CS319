import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChangePassword from "../../../319_Frontend/src/passwordOperations/ChangePassword";

const App = () => {

    return (
        <div>
            <Routes>
                <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
        </div>
    );
};

export default App;
