import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import MetaData from '../layout/metaData';
import Sidebar from '../layout/Sidebar';
import Loader from '../layout/Loader';

const NewDelivery = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validatePhoneNumber = (phone) => /^\d{11}$/.test(phone);
    const validatePassword = (pass) => pass.length >= 6;
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateName = (name) => name.length > 2;

    useEffect(() => {
        const fetchDeliveryMen = async () => {
            try {
                const currentUser = auth.currentUser;
                const supplierId = currentUser.uid;

                const deliveryMenQuery = query(collection(db, 'users'), where('usertype', '==', 'delivery'), where('supplierId', '==', supplierId));
                const querySnapshot = await getDocs(deliveryMenQuery);

                const deliveryMenData = [];
                querySnapshot.forEach((doc) => {
                    deliveryMenData.push({ id: doc.id, ...doc.data() });
                });
            } catch (error) {
                console.error('Error fetching delivery men:', error);
            }
        };
        fetchDeliveryMen();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        let formIsValid = true;
        let fieldErrors = {};

        if (!name) {
            formIsValid = false;
            fieldErrors.name = 'Name field is required.';
        } else if (!validateName(name)) {
            formIsValid = false;
            fieldErrors.name = 'Name must be more than three words.';
        }

        if (!email) {
            formIsValid = false;
            fieldErrors.email = 'Email field is required.';
        } else if (!validateEmail(email)) {
            formIsValid = false;
            fieldErrors.email = 'Please enter a valid email address.';
        }

        if (!phoneNumber) {
            formIsValid = false;
            fieldErrors.phoneNumber = 'Phone number field is required.';
        } else if (!validatePhoneNumber(phoneNumber)) {
            formIsValid = false;
            fieldErrors.phoneNumber = 'Phone number must be exactly 11 digits.';
        }

        if (!address) {
            formIsValid = false;
            fieldErrors.address = 'Address field is required.';
        }

        if (!city) {
            formIsValid = false;
            fieldErrors.city = 'City field is required.';
        }

        if (!password) {
            formIsValid = false;
            fieldErrors.password = 'Password field is required.';
        } else if (!validatePassword(password)) {
            formIsValid = false;
            fieldErrors.password = 'Password must be at least 6 characters long.';
        }

        if (!confirmPassword) {
            formIsValid = false;
            fieldErrors.confirmPassword = 'Confirm password field is required.';
        } else if (password !== confirmPassword) {
            formIsValid = false;
            fieldErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(fieldErrors);

        if (!formIsValid) {
            setLoading(false);
            return;
        }

        try {
            const currentUser = auth.currentUser;
            const currentEmail = currentUser.email;
            const currentPassword = prompt('Please re-enter your password to continue:', '');

            if (!currentPassword) {
                setLoading(false);
                alert('Password entry is required.');
                return;
            }

            const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name,
                phoneNumber,
                email,
                address,
                city,
                usertype: 'delivery',
                supplierId: currentUser.uid
            });

            await signOut(auth);
            await signInWithEmailAndPassword(auth, currentEmail, currentPassword);

            alert('Delivery man added successfully.');
            navigate('/admin/users');
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <MetaData title="Add Delivery" />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                
                <div className="col-12 col-md-10">
                    <div className="wrapper my-5">
                        <form className="shadow-lg" onSubmit={handleFormSubmit} encType="multipart/form-data">
                            <h1 className="mb-4">Add Delivery Man</h1>

                            {loading && <Loader />}
                            {errors.general && <div className="alert alert-danger">{errors.general}</div>}

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className={`form-control ${errors.name && 'is-invalid'}`}
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
                                    className={`form-control ${errors.phoneNumber && 'is-invalid'}`}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className={`form-control ${errors.email && 'is-invalid'}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <div className="error-message">{errors.email}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="city_field">City</label>
                                <input
                                    type="text"
                                    id="city_field"
                                    className={`form-control ${errors.city && 'is-invalid'}`}
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                                {errors.city && <div className="error-message">{errors.city}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="address_field">Address</label>
                                <input
                                    type="text"
                                    id="address_field"
                                    className={`form-control ${errors.address && 'is-invalid'}`}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                {errors.address && <div className="error-message">{errors.address}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password_field">Password</label>
                                <input
                                    type="password"
                                    id="password_field"
                                    className={`form-control ${errors.password && 'is-invalid'}`}
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
                                    className={`form-control ${errors.confirmPassword && 'is-invalid'}`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                            </div>

                            <button
                                id="create_button"
                                type="submit"
                                className="btn btn-block py-3"
                                disabled={loading}
                            >
                                CREATE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NewDelivery;
