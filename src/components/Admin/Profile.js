import MetaData from '../layout/metaData';
import Loader from '../layout/Loader';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithGoogle, auth, db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";



const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'supplier', currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({ ...currentUser, ...userData }); // Merge currentUser with userData
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleSignIn = () => {
        signInWithGoogle(); // Trigger Google sign-in
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={'Your Profile'} />
                    <h2 className="mt-5 ml-5">My Profile</h2>
                    <div className="row justify-content-around mt-5 user-info">
                        <div className="col-12 col-md-3">
                            <figure className='avatar avatar-profile'>
                                <img className="rounded-circle img-fluid" src={user && user.avatar} alt={user && user.name} />
                            </figure>
                            <Link to="/me/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                                Edit Profile
                            </Link>
                        </div>

                        <div className="col-12 col-md-5">
                            <h4>Full Name</h4>
                            <p>{user && user.name}</p>
                            <h4>Email Address</h4>
                            <p>{user && user.email}</p>
                            <h4>Joined On</h4>
                            <p>{user && new Date(user.metadata.creationTime).toLocaleDateString()}</p>

                        </div>
                    </div>
                    {!user && ( // Show Google sign-in button if no user is signed in
                        <div className="text-center mt-5">
                            <button onClick={handleGoogleSignIn} className="btn btn-danger py-3 px-5">
                                Sign In with Google
                            </button>
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default Profile;