// Header.jsx
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { app } from "../Database/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "../Styles/Header.css";
import { useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const AUTH = getAuth(app);
        const unSubscribe = onAuthStateChanged(AUTH, (user) => {
            if (user) {
                localStorage.setItem("isLoggedIn", "true");
            } else {
                localStorage.removeItem("isLoggedIn");
            }
        });

        const isLoggedInStored = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedInStored) {
            setIsLoggedIn(true);
        }

        return () => unSubscribe();
    }, [setIsLoggedIn]);

    const handleLogout = () => {
        const AUTH = getAuth(app);
        signOut(AUTH).then(() => {
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            localStorage.removeItem("UserMail");
            navigate("/Login");
        }).catch(error => {
            console.log(error.message);
        });
    };

    return (
        <>
            <div className="Header-Nav">
                <div className="HDNM">
                    <h1 className="HDH1">Expense Report</h1>
                </div>
                {
                    isLoggedIn &&
                    <div className="HDNAuth">
                        <div>
                            <Link className="BTN EXP" to="/Expense">Expense</Link>
                        </div>
                        <div>
                            <Link className="BTN PRF" to="/Profile">Profile</Link>
                        </div>
                        <div>
                            <button className="BTN LGOT" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                }
                <div className="HDNAuth1">
                    {!isLoggedIn && location.pathname !== "/Signup" && location.pathname !== "/Login" && (
                        <Link className="BTN SGUP" to="/Signup">Sign Up</Link>
                    )}
                </div>
            </div>
        </>
    );
};
export default Header;