import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { getDoc, doc } from "firebase/firestore";

const Header = () => {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                fetchUserData(user.uid);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);


    const fetchUserData = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'supplier', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserName(userData.name);
                setUserImage(userData.avatar || '/images/supplier.png');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const logoutHandler = async () => {
        try {
            await auth.signOut(); // Sign out user with Firebase
            alert('Logged out successfully.');
        } catch (error) {
            alert('Error logging out.');
        }
    };


    return (
        <Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/">
                            <img src="/images/hs.png" alt="ASAS Logo" />
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    {user ? (
                        <div className="ml-4 dropdown d-inline">
                            <Link to="#!" className="btn dropdown-toggle text-white mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span>{userName}</span>
                                {userImage && <img className="ml-2 rounded-circle" src={userImage} alt="User Profile" style={{ width: '30px', height: '30px' }} />}
                            </Link>

                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                                <Link className="dropdown-item" to="/me">Profile</Link>
                                <button className="dropdown-item text-danger" onClick={logoutHandler}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="btn ml-4" id="login_btn">Login</Link>
                    )}
                </div>
            </nav>
        </Fragment>
    );
};

export default Header;