import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/metaData';
import Sidebar from './Sidebar';

const UpdateUser = () => {
    const { userId } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    setName(userDoc.data().name);
                    setEmail(userDoc.data().email);
                    setAddress(userDoc.data().address);

                    setPhoneNumber(userDoc.data().phoneNumber);
                    setLoading(false);
                } else {
                    setLoading(false);
                    alert('User not found');
                }
            } catch (error) {
                setLoading(false);
                alert(error.message);
            }
        };

        fetchUser();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'users', userId), {
                name,
                email,
                phoneNumber,
                address
            });
            setLoading(false);
            navigate('/admin/users');
            alert('Delivery man updated successfully');
        } catch (error) {
            setLoading(false);
            alert(error.message);
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }
    return (


        <Fragment>
            <MetaData title={'Add Delivery'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={handleSubmit} encType='multipart/form-data'>
                                <h1 className="mb-4">Edit Delivery Man</h1>

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
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone_number_field">Address</label>
                                    <input
                                        type="text"
                                        id="addressfield"
                                        className="form-control"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateUser;