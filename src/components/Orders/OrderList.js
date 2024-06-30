import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import Sidebar from '../layout/Sidebar';
import MetaData from '../layout/metaData';
import Loader from '../layout/Loader';

const OrdersList = () => {
    const [orders, setOrders] = useState([]); // Ensure initial state is an empty array
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error("No authenticated user found.");
            }

            const seller_id = currentUser.uid; // Assuming supplier ID is the UID of the authenticated user

            const ordersQuery = query(
                collection(db, 'orders'),
                where('seller_id', '==', seller_id)
            );
            const ordersSnapshot = await getDocs(ordersQuery);
            const fetchedOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setOrders(fetchedOrders);
            setFilteredOrders(fetchedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const submitHandler = (e) => {
        e.preventDefault();
        const searchResult = orders.filter(order => order.id.includes(search));
        setFilteredOrders(searchResult);
    };

    return (
        <Fragment>
            <MetaData title={'All Orders'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Orders</h1>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="orderId_field">Enter Order ID</label>
                                        <input
                                            type="text"
                                            id="orderId_field"
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
                                            <th>Order ID</th>
                                            <th>User ID</th>
                                            <th>Product ID</th>
                                            <th>Product Price</th>
                                            <th>Quantity</th>
                                            <th>Delivery Man ID</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.user_id}</td>
                                                <td>{order.product_id}</td>
                                                <td>${order.totalPrice}</td>
                                                <td>{order.Quantity}</td>
                                                <td>{order.delivery_id}</td>
                                                <td>
                                                    {order.status === "delivered" ? (
                                                        <span style={{ color: 'green' }}>{order.status}</span>
                                                    ) : (
                                                        <span style={{ color: 'red' }}>{order.status}</span>
                                                    )}
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

export default OrdersList;
