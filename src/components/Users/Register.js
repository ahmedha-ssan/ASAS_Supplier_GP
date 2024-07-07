import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
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
    const [errors, setErrors] = useState({}); // Error state

    const navigate = useNavigate();

    // Validation Functions
    const validatePhoneNumber = (number) => /^\d{11}$/.test(number);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password);

    const signUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        let validationErrors = {};

        if (name.length < 3 || name.length > 50) {
            validationErrors.name = 'Name must be between 3 and 50 characters.';
        }

        if (password !== confirmpassword) {
            validationErrors.confirmpassword = 'Passwords do not match.';
        }

        if (!validatePhoneNumber(phonenumber)) {
            validationErrors.phonenumber = 'Phone number must be exactly 11 digits.';
        }

        if (!validateEmail(email)) {
            validationErrors.email = 'Invalid email format.';
        }

        if (!validatePassword(password)) {
            validationErrors.password = 'Password must be 6-20 characters and include at least one uppercase letter, one lowercase letter, and one digit.';
        }

        if (address.length < 5 || address.length > 100) {
            validationErrors.address = 'Address must be between 5 and 100 characters.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const userRef = doc(db, 'supplier', email);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                setLoading(false);
                setErrors({ email: 'Email already in use.' });
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
            navigate('/'); // Redirect to home or any other page on successful registration
        } catch (error) {
            setLoading(false);
            setErrors({ general: error.message });
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
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_number_field">Phone Number</label>
                            <input
                                type="text"
                                id="phone_number_field"
                                className={`form-control ${errors.phonenumber ? 'is-invalid' : ''}`}
                                name='phonenumber'
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                            />
                            {errors.phonenumber && <div className="error-message">{errors.phonenumber}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className={`form-control ${errors.confirmpassword ? 'is-invalid' : ''}`}
                                name='confirmpassword'
                                value={confirmpassword}
                                onChange={(e) => setConfirmpassword(e.target.value)}
                            />
                            {errors.confirmpassword && <div className="error-message">{errors.confirmpassword}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                name='address'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            {errors.address && <div className="error-message">{errors.address}</div>}
                        </div>

                        {errors.general && <div className="error-message general-error">{errors.general}</div>}

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
