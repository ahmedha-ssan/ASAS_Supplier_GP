import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MetaData from '../layout/metaData';

const OrdersList = () => {
    // Dummy orders data
    const orders = [
        { _id: 1, orderItems: [{ id: 1, name: 'Product 1', price: 10 }, { id: 2, name: 'Product 2', price: 20 }], totalPrice: 30, orderStatus: 'Delivered' },
        { _id: 2, orderItems: [{ id: 3, name: 'Product 3', price: 15 }], totalPrice: 15, orderStatus: 'Processing' },
        // Add more dummy orders as needed
    ];

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
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>No of Items</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.orderItems.length}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>
                                                {order.orderStatus && String(order.orderStatus).includes('Delivered')
                                                    ? <span style={{ color: 'green' }}>{order.orderStatus}</span>
                                                    : <span style={{ color: 'red' }}>{order.orderStatus}</span>
                                                }
                                            </td>
                                            <td>
                                                <Link to={`/admin/order/${order._id}`} className="btn btn-primary py-1 px-2">
                                                    <i className="fa fa-eye"></i>
                                                </Link>
                                                <button className="btn btn-danger py-1 px-2 ml-2" >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                                {/* You can add more actions if needed */}
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