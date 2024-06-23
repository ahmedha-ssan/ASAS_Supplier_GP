import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import MetaData from '../layout/metaData';
import Sidebar from '../layout/Sidebar';

const NewDelivery = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [supplierId, setSupplierId] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [deliveryMen, setDeliveryMen] = useState([]);
    const navigate = useNavigate();

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{11}$/;
        return phoneRegex.test(phone);
    };

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
                setDeliveryMen(deliveryMenData);
            } catch (error) {
                console.error('Error fetching delivery men:', error);
            }
        };
        fetchDeliveryMen();
    }, []);


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
            // Save the current user session data
            const currentUser = auth.currentUser;
            const currentEmail = currentUser.email;
            const currentPassword = prompt("Please re-enter your password to continue:", "");

            if (!currentPassword) {
                setLoading(false);
                alert('Password entry is required.');
                return;
            }
            // Re-authenticate the current user
            const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);

            // Create the new delivery man user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name,
                phoneNumber,
                email,
                address,
                city,
                usertype: "delivery",
                supplierId: currentUser.uid
            });

            setLoading(true);

            await signOut(auth);
            await signInWithEmailAndPassword(auth, currentEmail, currentPassword);

            setLoading(false);

            navigate('/admin/users');

        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                alert('The password you entered is incorrect.');
            } else {
                alert(error.message);
            }
        } finally {
            setLoading(false);
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
                                    <label htmlFor="address_field">City</label>
                                    <input
                                        type="text"
                                        id="address_field"
                                        className="form-control"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
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
                                    <label htmlFor="confirmpassword_field">Confirm Password</label>
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
    );
}

export default NewDelivery;