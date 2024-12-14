import React from "react";
import ChangePassword from "./passwordOperations/ChangePassword";

function App() {
    return <ChangePassword />;
}

export default App;

/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChangePassword from './passwordOperations/ChangePassword';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
        </Router>
    );
}

export default App;
*/