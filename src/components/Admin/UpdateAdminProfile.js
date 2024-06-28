import React, { useState, useEffect, Fragment } from 'react';
import { auth, db } from '../../firebase';
import MetaData from '../layout/metaData';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/public/images/default_avatar.jpg');
    const [phonenumber, setPhonenumber] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userDoc = await getDoc(doc(db, 'supplier', currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setName(userData.name);
                        setEmail(userData.email); // Setting email from fetched data
                        setPhonenumber(userData.phonenumber);
                        setAddress(userData.address);
                        setAvatarPreview(userData.avatar?.url || '/images/default_avatar.jpg');
                    } else {
                        setError('User not found');
                    }
                } else {
                    setError('User not authenticated');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                await updateDoc(doc(db, 'supplier', currentUser.uid), {
                    name,
                    phonenumber,
                    address,
                    avatar
                });
                setLoading(false);
                navigate('/me');
                alert('Profile updated successfully');
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const validateForm = () => {
        let valid = true;
        const errors = {};

        if (!name.trim()) {
            errors.name = 'Name is required';
            valid = false;
        }

        if (!phonenumber.trim()) {
            errors.phonenumber = 'Phone number is required';
            valid = false;
        } else if (!/^\d{11}$/.test(phonenumber.trim())) {
            errors.phonenumber = 'Phone number must be exactly 11 digits';
            valid = false;
        }

        if (!address.trim()) {
            errors.address = 'Address is required';
            valid = false;
        }

        setError(errors);
        return valid;
    };

    const onChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Fragment>
            <MetaData title={'Update Profile'} />
            <div className="wrapper my-5">
                <form className="shadow-lg" onSubmit={handleSubmit} encType="multipart/form-data">
                    <h1 className="mb-4">Update Profile</h1>

                    {error && (
                        <div className="alert alert-danger">
                            {error.name && <p>{error.name}</p>}
                            {error.phonenumber && <p>{error.phonenumber}</p>}
                            {error.address && <p>{error.address}</p>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className={`form-control ${error && error.name ? 'is-invalid' : ''}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {error && error.name && <div className="invalid-feedback">{error.name}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            disabled // Making the email field disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone_number_field">Phone Number</label>
                        <input
                            type="text"
                            id="phone_number_field"
                            className={`form-control ${error && error.phonenumber ? 'is-invalid' : ''}`}
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                        />
                        {error && error.phonenumber && <div className="invalid-feedback">{error.phonenumber}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="address_field">Address</label>
                        <input
                            type="text"
                            id="address_field"
                            className={`form-control ${error && error.address ? 'is-invalid' : ''}`}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {error && error.address && <div className="invalid-feedback">{error.address}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="avatar_upload">Avatar</label>
                        <div className="d-flex align-items-center">
                            <div>
                                <figure className="avatar mr-3 item-rtl">
                                    <img
                                        src={avatarPreview}
                                        className="rounded-circle"
                                        alt="Avatar Preview"
                                    />
                                </figure>
                            </div>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    name="avatar"
                                    className="custom-file-input"
                                    id="customFile"
                                    accept="image/*"
                                    onChange={onChange}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        </Fragment>
    );
};

export default UpdateProfile;
