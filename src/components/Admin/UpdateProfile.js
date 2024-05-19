import React, { useState, useEffect, Fragment } from 'react';
import { auth, db } from '../../firebase';
import MetaData from '../layout/metaData';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';



const UpdateProfile = ({ history }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/public/images/default_avatar.jpg');
    const [phonenumber, setPhonenumber] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        setName(userDoc.data().name);
                        setEmail(userDoc.data().email);
                        setPhonenumber(userDoc.data().phonenumber);
                        setAddress(userDoc.data().address);
                        setAvatarPreview(userDoc.data().avatar.url || '/images/default_avatar.jpg');
                    } else {
                        setLoading(false);
                        alert('User not found');
                    }
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                alert(error.message);
            }
        };
        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    name,
                    email,
                    phonenumber,
                    address,
                    avatar
                });
                setLoading(false);
                navigate('/me');
                alert('Profile updated successfully');
            }
        } catch (error) {
            setLoading(false);
            alert(error.message);
        }
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
                    <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone_number_field">Phone Number</label>
                        <input
                            type="text"
                            id="phone_number_field"
                            className="form-control"
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address_field">Address</label>
                        <input
                            type="text"
                            id="address_field"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
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