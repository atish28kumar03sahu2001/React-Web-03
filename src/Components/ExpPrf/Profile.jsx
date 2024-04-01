import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, update, onValue } from "firebase/database";
import { app } from "../Database/firebase";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import "../Styles/Profile.css";
import { useLocation } from "react-router-dom";
import { getAuth, sendEmailVerification } from "firebase/auth";

const Profile = () => {
    const userEmail = localStorage.getItem("UserMail");
    const userName = userEmail.split("@")[0];
    const location = useLocation();

    const [Sname, setSname] = useState(location.state ? location.state[1].name : "");
    const [Semail, setSemail] = useState(location.state ? location.state[1].email : "");
    const [Sphone, setSphone] = useState(location.state ? location.state[1].phone : "");
    const [Simage, setImage] = useState(null);

    const HandleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    }

    const [profileData, setProfileData] = useState(null);
    useEffect(() => {
        const DB = getDatabase(app);
        const profileRef = ref(DB, `Expense/${userEmail.replace('.', '')}/Profile`);

        const unsubscribe = onValue(profileRef, (snapshot) => {
            const data = snapshot.val();
            setProfileData(data);
        });

        return () => {
            unsubscribe();
        };
    }, [userEmail]);

    const DataSubmit = async (event) => {
        event.preventDefault();
        const OBJ = { name: Sname, email: Semail, phone: Sphone, image: Simage };
        const DB = getDatabase(app);
        const STORAGE = getStorage(app);
        const ImgRef = storageRef(STORAGE, `UserProfile/${userEmail.replace('.', '')}`);
        let imageURL = "";
        if (Simage) {
            await uploadBytes(ImgRef, OBJ.image);
            imageURL = await getDownloadURL(ImgRef);
        } else {
            const existinigImgRef = storageRef(STORAGE, `UserProfile/${userEmail.replace('.', '')}`);
            imageURL = await getDownloadURL(existinigImgRef);
        }

        const profileRef = ref(DB, `Expense/${userEmail.replace('.', '')}/Profile`);

        // Check if profileData already exists, indicating an edit operation
        if (profileData) {
            // Update existing data
            update(profileRef, { name: OBJ.name, email: OBJ.email, phone: OBJ.phone, image: imageURL })
                .then(res => console.log(res))
                .catch(error => console.log(error.message));
        } else {
            // Add new data
            set(profileRef, { name: OBJ.name, email: OBJ.email, phone: OBJ.phone, image: imageURL })
                .then(res => console.log(res))
                .catch(error => console.log(error.message));
        }

        setSname("");
        setSemail("");
        setSphone("");
    }

    const HandleVerifyEmail = async () => {
        try {
            const AUTH = getAuth(app);
            const user = AUTH.currentUser;
            if (user) {
                await sendEmailVerification(user);
                alert('Email verification sent. Check your inbox.');
            } else {
                alert('No user is currently authenticated.');
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <>
            <div className="PFHD">
                <p className="PFP">Hi, {userName}</p>
                <p className="PFP">Welcome To Your Profile Section.</p>
            </div>
            <div className="PFRMD">
                <form onSubmit={DataSubmit} className="PFRMFD">
                    <div className="IPL">
                        <label className="LBL" htmlFor="name">User Name:</label>
                        <input className="IP P" required value={Sname} type="text" placeholder="User Name" onChange={e => setSname(e.target.value)} />
                    </div>
                    <div className="IPL">
                        <label className="LBL" htmlFor="email">User Email:</label>
                        <input className="IP P" required value={Semail} type="email" placeholder="User Email" onChange={e => setSemail(e.target.value)} />
                    </div>
                    <div className="IPL">
                        <label className="LBL" htmlFor="phone">User Phone:</label>
                        <input className="IP P" required value={Sphone} type="text" placeholder="User Phone" onChange={e => setSphone(e.target.value)} />
                    </div>
                    <div className="IPL">
                        <label className="LBL" htmlFor="profilephoto">Profile Photo:</label>
                        <input className="IP CF" type="file" onChange={HandleFileChange} />
                    </div>
                    <div>
                        <button className="BTN PFB" type="submit">Submit</button>
                    </div>
                </form>
            </div>
            <div className="PFDT">
                {profileData && (
                    <div className="PFDDT">
                        <p>{profileData.name}</p>
                        <div>
                            <p>{profileData.email}</p>
                            <button className="BTN VEB" type="button" onClick={HandleVerifyEmail}>Verify Email</button>
                        </div>
                        <p>{profileData.phone}</p>
                        <img src={profileData.image} alt="ProfilePhoto" width="100px" height="90px" style={{borderRadius: "20px", margin: "5px"}} />
                    </div>
                )}
            </div>
        </>
    );
}
export default Profile;