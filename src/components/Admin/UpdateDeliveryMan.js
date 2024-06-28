import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import MetaData from '../layout/metaData';
import Sidebar from '../layout/Sidebar';

const UpdateUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: ''
    });

    const [validationErrors, setValidationErrors] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        city: ''
    });

    const { name, email, phoneNumber, address, city } = user;

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const currentUser = auth.currentUser;
                const userDoc = await getDoc(doc(db, 'users', userId));
                const userData = userDoc.data();

                if (userData.usertype === 'delivery' && userData.supplierId === currentUser.uid) {
                    setUser(userData);
                } else {
                    alert('User not found or unauthorized');
                    navigate('/admin/users');
                }
            } catch (error) {
                setError('Error fetching user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setValidationErrors({ ...validationErrors, [e.target.name]: '' }); // Clear validation error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formIsValid = true;
        const newErrors = {};

        // Validate phone number
        const phoneNumberRegex = /^\d{11}$/;
        if (!phoneNumberRegex.test(phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 11 digits';
            formIsValid = false;
        }

        // Validate other fields
        if (!name) {
            newErrors.name = 'Name is required';
            formIsValid = false;
        }

        if (!address) {
            newErrors.address = 'Address is required';
            formIsValid = false;
        }

        if (!city) {
            newErrors.city = 'City is required';
            formIsValid = false;
        }

        if (!formIsValid) {
            setValidationErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', userId), {
                name,
                phoneNumber,
                address,
                city
            });
            alert('Delivery man updated successfully');
            navigate('/admin/users');
        } catch (error) {
            setError('Error updating user');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Fragment>
            <MetaData title={'Edit Delivery Man'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <div className="wrapper my-5">
                        <form className="shadow-lg" onSubmit={handleSubmit}>
                            <h1 className="mb-4">Edit Delivery Man</h1>

                            {error && <p className="text-danger">{error}</p>}

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className={`form-control ${validationErrors.name && 'is-invalid'}`}
                                    name="name"
                                    value={name}
                                    onChange={handleChange}
                                />
                                {validationErrors.name && <div className="invalid-feedback">{validationErrors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email (Cannot be changed)</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone_number_field">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone_number_field"
                                    className={`form-control ${validationErrors.phoneNumber && 'is-invalid'}`}
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    onChange={handleChange}
                                />
                                {validationErrors.phoneNumber && <div className="invalid-feedback">{validationErrors.phoneNumber}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="city_field">City</label>
                                <input
                                    type="text"
                                    id="city_field"
                                    className={`form-control ${validationErrors.city && 'is-invalid'}`}
                                    name="city"
                                    value={city}
                                    onChange={handleChange}
                                />
                                {validationErrors.city && <div className="invalid-feedback">{validationErrors.city}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="address_field">Address</label>
                                <input
                                    type="text"
                                    id="address_field"
                                    className={`form-control ${validationErrors.address && 'is-invalid'}`}
                                    name="address"
                                    value={address}
                                    onChange={handleChange}
                                />
                                {validationErrors.address && <div className="invalid-feedback">{validationErrors.address}</div>}
                            </div>

                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateUser;
