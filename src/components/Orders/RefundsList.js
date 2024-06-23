import React, { Fragment, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import MetaData from '../layout/metaData';

const RefundsList = () => {
    // Dummy refund requests data
    const refundRequests = [
        {
            _id: 1,
            product: { id: 1, name: 'Product 1', image: 'images/default_avatar.jpg', maxQuantity: 3 },
            quantity: 2,
            reason: 'Product damaged',
            moreInfo: 'Box was opened',
            returnMethod: 'Courier pickup',
            city: 'New York',
            address: '123 Main St',
            refundMethod: 'Credit Card'
        },
        {
            _id: 2,
            product: { id: 2, name: 'Product 2', image: 'product2.jpg', maxQuantity: 1 },
            quantity: 1,
            reason: 'Not as described',
            moreInfo: 'Wrong color received',
            returnMethod: 'Store drop-off',
            city: 'Los Angeles',
            address: '456 Elm St',
            refundMethod: 'Bank Transfer'
        },

    ];

    const [search, setSearch] = useState('');
    const [filteredRefunds, setFilteredRefunds] = useState(refundRequests);

    const submitHandler = (e) => {
        e.preventDefault();
        const searchResult = refundRequests.filter(refund => refund._id.toString().includes(search));
        setFilteredRefunds(searchResult);
    };

    const handleRefundAction = (id, action) => {
        alert(`Refund request ID ${id} has been ${action}`);
        // Implement logic to accept or reject the refund in the actual app
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
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Refund ID</th>
                                        <th>Product Image</th>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Reason</th>
                                        <th>More Info</th>
                                        <th>Return Method</th>
                                        <th>City</th>
                                        <th>Address</th>
                                        <th>Refund Method</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRefunds.map(refund => (
                                        <tr key={refund._id}>
                                            <td>{refund._id}</td>
                                            <td><img src={`/${refund.product.image}`} alt={refund.product.name} width="50" height="50" /></td>
                                            <td>{refund.product.name}</td>
                                            <td>{refund.quantity}</td>
                                            <td>{refund.reason}</td>
                                            <td>{refund.moreInfo}</td>
                                            <td>{refund.returnMethod}</td>
                                            <td>{refund.city}</td>
                                            <td>{refund.address}</td>
                                            <td>{refund.refundMethod}</td>
                                            <td>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleRefundAction(refund._id, 'accepted')}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm ml-2"
                                                    onClick={() => handleRefundAction(refund._id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
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
export default RefundsList;
