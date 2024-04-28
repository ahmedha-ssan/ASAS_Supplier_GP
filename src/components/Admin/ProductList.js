import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layout/metaData';
import Sidebar from './Sidebar'
const ProductsList = () => {


    const products = [
        { _id: 1, name: 'Dummy Product 1', price: 10, stock: 50 },
        { _id: 2, name: 'Dummy Product 2', price: 20, stock: 30 },
        { _id: 3, name: 'Dummy Product 3', price: 15, stock: 20 },
    ];
    const deleteProductHandler = (id) => {
        // Implement delete functionality here if needed
    };

    return (
        <Fragment>
            <MetaData title={'All Products'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Products</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2">
                                                <i className="fa fa-pencil"></i>
                                            </Link>
                                            <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteProductHandler(product._id)}>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default ProductsList;