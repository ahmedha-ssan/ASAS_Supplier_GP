import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import MetaData from '../layout/metaData';
import Sidebar from './Sidebar';


const NewDelivery = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{11}$/;
        return phoneRegex.test(phone);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validatePhoneNumber(phoneNumber)) {
            setLoading(false);
            alert('Phone number must be exactly 11 digits.');
            return;
        }

        if (password.length < 6) {
            setLoading(false);
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name,
                phoneNumber,
                email,
                address,
                usertype: "delivery"
            });
            await signOut(auth);
            setLoading(false);
            navigate('/admin/users'); // Redirect to delivery men list page on successful creation
        } catch (error) {
            setLoading(false);
            alert(error.message); // Handle error appropriately in your application
        }
    };



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
                            <form className="shadow-lg" onSubmit={handleFormSubmit} encType='multipart/form-data'>
                                <h1 className="mb-4">Add Delivery Man</h1>

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
                                    <label htmlFor="password_field">Password</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password_field">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmpassword_field"
                                        className="form-control"
                                        value={confirmpassword}
                                        onChange={(e) => setconfirmpassword(e.target.value)}
                                        required
                                    />
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
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default NewDelivery;