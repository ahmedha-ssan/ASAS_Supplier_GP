import React, { Fragment, useState, useEffect } from 'react'
import { Link, Route } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { collection, getDoc, getDocs, addDoc, doc } from "firebase/firestore";

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchUserName = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log(userData.name);
                return userData.name;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user name:', error);
            return null;
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
    useEffect(() => {
        if (user) {
            fetchUserName(user.uid).then((name) => {
                setUser({ ...user, name });
            });
        }
    }, [user]);
    return (
        <Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/">
                            <img src="/images/shopit_logo.png" alt="ShopIT Logo" />
                        </Link>
                    </div>
                </div>


                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">


                    {user ? (
                        <div className="ml-4 dropdown d-inline">
                            <Link to="#!" className="btn dropdown-toggle text-white mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span>{user.name || user.name}</span>
                            </Link>

                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">

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