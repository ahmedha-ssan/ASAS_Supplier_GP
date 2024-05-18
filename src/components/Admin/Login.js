import React, { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase'
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import MetaData from '../layout/metaData';
import Loader from '../layout/Loader'


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
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);

            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log(userData.usertype)
                console.log("userData.userType")

                if (userData.usertype == 'supplier') {
                    navigate('/');
                } else {
                    setLoading(false);
                    alert('Only suppliers are allowed to sign in');
                    // Sign out the user
                    await auth.signOut();
                }
            } else {
                console.error('User data not found');
            }
        } catch (error) {
            setLoading(false);
            alert(error.message); // Handle error appropriately in your application
        }
    };



    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
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