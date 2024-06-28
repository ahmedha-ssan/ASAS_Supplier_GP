import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithPopup, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';
import { auth, db, provider } from '../../firebase'
import { getDoc, doc } from "firebase/firestore";
import MetaData from '../layout/metaData';
import Loader from '../layout/Loader';

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const validatePassword = (password) => {
    return password.length >= 6; // Ensure password is at least 6 characters long
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateEmail(email)) {
            setLoading(false);
            alert('Invalid email format');
            return;
        }
        if (!validatePassword(password)) {
            setLoading(false);
            alert('Password must be at least 6 characters long');
            return;
        }


        try {
            await setPersistence(auth, browserSessionPersistence);


            setLoading(false);
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            auth.signOut();
            setLoading(true);
            const userDoc = await getDoc(doc(db, 'supplier', user.uid));
            if (userDoc.exists()) {
                // eslint-disable-next-line no-unused-vars
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                setLoading(false);
                navigate('/');
            } else {
                setLoading(false);
                alert('User data not found');
            }
        } catch (error) {
            setLoading(false);
            alert(error.message); // Handle error appropriately in your application
        }
    };
    // Google sign-in handler
    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            // Set session persistence for authentication
            await setPersistence(auth, browserSessionPersistence);

            // Sign in with Google
            const { user } = await signInWithPopup(auth, provider);

            // Check if user data exists in Firestore
            const userDoc = await getDoc(doc(db, 'supplier', user.uid));
            if (userDoc.exists()) {
                navigate('/');
            } else {
                alert('User data not found');
                await auth.signOut();
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Fragment >
            {loading ? <Loader /> : (
                <Fragment className="yasser">
                    <MetaData title={'Login'} />

                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>

                                <h1 className="mb-3">Login</h1>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password_field">Password</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading}
                                >
                                    LOGIN
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-block py-3 mt-3"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >

                                    <img src="/images/sss.png" alt="Google Logo" style={{ width: '30px', marginRight: '30px' }} />

                                    SIGN IN WITH GOOGLE
                                </button>
                                <Link to="/Register" className="float-right mt-3">New User?</Link>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Login;