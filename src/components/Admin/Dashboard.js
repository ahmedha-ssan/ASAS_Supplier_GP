import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Sidebar from '../layout/Sidebar'
import { collection, getDocs, where, query } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import { db, auth } from '../../firebase';

const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [outOfStockCount, setOutOfStockCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [refundsCount, setRefundsCount] = useState(0);
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const currentUser = auth.currentUser;
                const supplierId = currentUser.uid;

                // Fetch delivery men count
                const deliveryQuery = query(collection(db, 'users'), where('usertype', '==', 'delivery'), where('supplierId', '==', supplierId));
                const querySnapshot = await getDocs(deliveryQuery);
                setUserCount(querySnapshot.size);

                // Fetch products count
                const myDB = getDatabase();
                const productsRef = ref(myDB, 'products');
                onValue(productsRef, (snapshot) => {
                    let count = 0;
                    let total = 0;
                    let outOfStock = 0;

                    snapshot.forEach((childSnapshot) => {
                        const product = childSnapshot.val();
                        if (product.userId === supplierId) {
                            count++;
                            const price = parseFloat(product.price);
                            const stock = parseInt(product.stock, 10);
                            total += price * stock;
                            // eslint-disable-next-line eqeqeq
                            if (product.stock == 0) {
                                outOfStock++;
                            }
                        }
                    });
                    setTotalPrice(total);
                    setProductCount(count);
                    setOutOfStockCount(outOfStock);
                    console.log('Total:', total);

                });
            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };

        fetchCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Fragment>
            <div className="row">

                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <h1 className="my-4">Dashboard</h1>
                    <div className="row pr-4">
                        <div className="col-xl-12 col-sm-12 mb-3">
                            <div className="card text-white bg-primary o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">Total Amount<br /> <b>EGP: {totalPrice}</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pr-4">
                        <div className="col-xl-3 col-sm-6 mb-3">
                            <div className="card text-white bg-success o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">Products<br /> <b>{productCount}</b></div>
                                </div>
                                <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>


                        <div className="col-xl-3 col-sm-6 mb-3">
                            <div className="card text-white bg-danger o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">Orders<br /> <b>125</b></div>
                                </div>
                                <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>


                        <div className="col-xl-3 col-sm-6 mb-3">
                            <div className="card text-white bg-dark o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">Refunds<br /> <b>125</b></div>
                                </div>
                                <Link className="card-footer text-white clearfix small z-1" to="/admin/refunds">
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>


                        <div className="col-xl-3 col-sm-6 mb-3">
                            <div className="card text-white bg-info o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">Delivery Men<br /> <b>{userCount}</b></div>
                                </div>
                                <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>


                        <div className="col-xl-3 col-sm-6 mb-3">
                            <div className="card text-white bg-warning o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">Out of Stock<br /> <b>{outOfStockCount}</b></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Fragment>
    )
}

export default Dashboard
