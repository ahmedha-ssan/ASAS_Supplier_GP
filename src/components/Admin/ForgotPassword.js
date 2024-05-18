import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import MetaData from '../layout/metaData';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateEmail(email)) {
            setLoading(false);
            alert('Invalid email format');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setLoading(false);
            alert('Password reset email sent successfully');
            navigate('/'); // Redirect to home or any other page after sending the email
        } catch (error) {
            setLoading(false);
            alert(error.message); // Handle error appropriately in your application
        }
    };

    return (
        <Fragment>
            <MetaData title={'Forgot Password'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            Send Email
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default ForgotPassword;