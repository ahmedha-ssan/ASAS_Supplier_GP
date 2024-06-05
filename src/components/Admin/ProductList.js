import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layout/metaData';
import Sidebar from './Sidebar'
import { getDatabase, ref as rtdbRef, onValue, remove } from 'firebase/database';
import { app } from '../../firebase.js';
import { getAuth } from 'firebase/auth';

const database = getDatabase(app);
const auth = getAuth(app);

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserId(user.uid);

                const productsRef = rtdbRef(database, 'products');
                onValue(productsRef, (snapshot) => {
                    const productsData = snapshot.val();
                    const productsList = [];
                    for (let id in productsData) {
                        if (productsData[id].userId === user.uid) {
                            productsList.push({ _id: id, ...productsData[id] });
                        }
                    }
                    setProducts(productsList);
                });
            } else {
                setUserId(null);
                setProducts([]);
            }
        });

        return () => unsubscribe();
    }, []);


    const deleteProductHandler = (id) => {
        const productRef = rtdbRef(database, `products/${id}`);
        remove(productRef);
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
                                        <td>{product.productName}</td>
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