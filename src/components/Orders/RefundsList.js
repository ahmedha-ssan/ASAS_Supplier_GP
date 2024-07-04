import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import Sidebar from '../layout/Sidebar';
import MetaData from '../layout/metaData';
import Loader from '../layout/Loader';

const RefundsList = () => {
    const [refunds, setRefunds] = useState([]);
    const [filteredRefunds, setFilteredRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchRefunds = useCallback(async () => {
        setLoading(true);
        try {
            // Get the currently authenticated user
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error("No authenticated user found.");
            }

            const sellerId = currentUser.uid; // Assuming seller ID is the UID of the authenticated user

            // Query refunds where the seller_id matches the current user's ID
            const refundsQuery = query(
                collection(db, 'refunds'),
                where('seller_id', '==', sellerId),
                where('status', '==', 'pending')
            );
            const refundsSnapshot = await getDocs(refundsQuery);
            const fetchedRefunds = refundsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setRefunds(fetchedRefunds);
            setFilteredRefunds(fetchedRefunds);
        } catch (error) {
            console.error('Error fetching refunds:', error);
            alert('Failed to fetch refunds');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRefunds();
    }, [fetchRefunds]);

    const submitHandler = (e) => {
        e.preventDefault();
        const searchResult = refunds.filter(refund => refund.id.includes(search));
        setFilteredRefunds(searchResult);
    };

    const handleRefundAction = async (id, action) => {
        try {
            const refundDoc = doc(db, 'refunds', id);
            await updateDoc(refundDoc, {
                status: action === 'accepted' ? 'approved' : 'rejected'
            });
            alert(`Refund request ID ${id} has been ${action}`);

            // Refresh refunds list
            fetchRefunds();
        } catch (error) {
            console.error(`Error updating refund status:`, error);
            alert('Failed to update refund status');
        }
    };
    return (
        <Fragment>
            <MetaData title={'Refund Requests'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">Refund Requests</h1>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="refundId_field">Enter Refund ID</label>
                                        <input
                                            type="text"
                                            id="refundId_field"
                                            className="form-control"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        id="search_button"
                                        type="submit"
                                        className="btn btn-primary btn-block py-2"
                                    >
                                        SEARCH
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="table-responsive mt-5">
                            {loading ? (
                                <Loader />
                            ) : (
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Refund ID</th>
                                            <th>Refund Amount</th>
                                            <th>User ID</th>
                                            <th>Order ID</th>
                                            <th>Product ID</th>
                                            <th>Quantity</th>
                                            <th>Reason</th>
                                            <th>Return Method</th>
                                            <th>City</th>
                                            <th>Address</th>
                                            <th>Refund Method</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRefunds.map(refund => (
                                            <tr key={refund.id}>
                                                <td>{refund.id}</td>
                                                <td>EGP {refund.RefundAmount}</td>
                                                <td>{refund.user_id}</td>
                                                <td>{refund.order_id}</td>
                                                <td>{refund.productId}</td>
                                                <td>{refund.quantity}</td>
                                                <td>{refund.reason}</td>
                                                <td>{refund.returnType}</td>
                                                <td>{refund.region}</td>
                                                <td>{refund.address}</td>
                                                <td>{refund.paymentType}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleRefundAction(refund.id, 'accepted')}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm ml-2"
                                                        onClick={() => handleRefundAction(refund.id, 'rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default RefundsList;
