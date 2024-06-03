import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore';
import MetaData from '../layout/metaData';




const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [address, setAddress] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const validatePhoneNumber = (number) => {
        const phoneRegex = /^\d{11}$/;
        return phoneRegex.test(number);
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        return passwordRegex.test(password);
    };
    const signUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (name.length < 3 || name.length > 50) {
            setLoading(false);
            alert('Name must be between 3 and 50 characters');
            return;
        }
        if (password !== confirmpassword) {
            setLoading(false);
            alert('Passwords do not match');
            return;
        }
        if (!validatePhoneNumber(phonenumber)) {
            setLoading(false);
            alert('Phone number must be exactly 11 digits');
            return;
        }
        if (!validateEmail(email)) {
            setLoading(false);
            alert('Invalid email format');
            return;
        }
        if (!validatePassword(password)) {
            setLoading(false);
            alert('Password must be 6-20 characters and include at least one uppercase letter, one lowercase letter, and one digit');
            return;
        }
        if (password !== confirmpassword) {
            setLoading(false);
            alert('Passwords do not match');
            return;
        }
        if (address.length < 5 || address.length > 100) {
            setLoading(false);
            alert('Address must be between 5 and 100 characters');
            return;
        }
        try {
            const userRef = doc(db, 'supplier', email);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                setLoading(false);
                alert('Email already in use');
                return;
            }
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'supplier', user.uid), {
                name,
                email,
                phonenumber,
                address,
                usertype: "supplier",
            });

            setLoading(false);
            navigate('/'); // Redirect to home or any other page on successful login
        } catch (error) {
            setLoading(false);
            alert(error.message); // Handle error appropriately in your application
        }
    };

    return (
        <Fragment>
            <MetaData title={'Register User'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" encType='multipart/form-data' onSubmit={signUp}>
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name_field">Phone Number</label>
                            <input
                                type="text"
                                id="phone_number_field"
                                className="form-control"
                                name='phonenumber'
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
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
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className="form-control"
                                name='confirmpassword'
                                value={confirmpassword}
                                onChange={(e) => setConfirmpassword(e.target.value)}

                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name_field">Address</label>
                            <input
                                type="text"
                                id="Address_field"
                                className="form-control"
                                name='Address'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}

                            />
                        </div>


                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            REGISTER
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default Register;