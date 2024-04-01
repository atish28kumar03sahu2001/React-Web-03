import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Welcome/Header";
import Welcome from "./Components/Welcome/Welcome";
import Signup from "./Components/Authentication/Signup";
import Login from "./Components/Authentication/Login";
import Profile from "./Components/ExpPrf/Profile";
import Expense from "./Components/ExpPrf/Expense";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    return (
        <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/Signup" element={<Signup />} />
                <Route  path="/Login"   element={<Login setIsLoggedIn={setIsLoggedIn} />}   render={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}  />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Expense" element={<Expense />} />
            </Routes>
        </>
    );
}
export default App;
