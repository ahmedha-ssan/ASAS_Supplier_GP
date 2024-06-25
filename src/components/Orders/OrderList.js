import React, { Fragment, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import MetaData from '../layout/metaData';

const OrdersList = () => {
    // Dummy orders data
    const orders = [
        { _id: 1, orderItems: [{ id: 1, name: 'Product 1', price: 10 }, { id: 2, name: 'Product 2', price: 20 }], totalPrice: 30, orderStatus: 'Delivered', deliveryMan: 'John Doe' },
        { _id: 2, orderItems: [{ id: 3, name: 'Product 3', price: 15 }], totalPrice: 15, orderStatus: 'Processing', deliveryMan: '2ltyar' },
        // Add more dummy orders as needed
    ];
    const [search, setSearch] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(orders);

    const submitHandler = (e) => {
        e.preventDefault();
        const searchResult = orders.filter(order => order._id.toString().includes(search));
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
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>User ID</th>
                                        <th>Product Image</th>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                        <th>Delivery Man</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order._id}</td>
                                            <td>{order._id}</td>
                                            <td>{order._id}</td>
                                            <td>{order.orderItems.length}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>{order.deliveryMan}</td>
                                            <td>
                                                {order.orderStatus && String(order.orderStatus).includes('Delivered')
                                                    ? <span style={{ color: 'green' }}>{order.orderStatus}</span>
                                                    : <span style={{ color: 'red' }}>{order.orderStatus}</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default OrdersList;