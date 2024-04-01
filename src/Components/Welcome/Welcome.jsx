import React from "react";
import '../Styles/Welcome.css';
const Welcome = () => {
    return (
        <>
            <div>
                <div className="WTER">
                    <h1 className="WTERH1">Welcome To Expense Report!</h1>
                </div>
                <div className="WTER">
                    <p className="WP">
                        The project utilizes React.js for a dynamic user interface, with React Router for navigation. Redux manages the application state, ensuring a seamless experience. Firebase Authentication provides secure user authentication, while Firebase Storage stores user profile images. The real-time Firebase database handles expense data, enabling real-time updates and persistence for an efficient expense reporting system.                    </p>
                </div>
            </div>
        </>
    );
}
export default Welcome;