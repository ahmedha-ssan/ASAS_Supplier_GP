/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom';
import MetaData from '../layout/metaData'
import Sidebar from '../Admin/Sidebar';
import { auth } from '../../firebase'

const Home = () => {

    const { keyword } = useParams();

    const products = [
        {
            id: 1,
            title: 'HP N4000',
            description: 'Description of product 1',
            price: 19.99,
            imageUrl: '',
        }, {
            id: 1,
            title: 'HP N4000',
            description: 'Description of product 1',
            price: 19.99,
            imageUrl: '',
        }, {
            id: 1,
            title: 'HP N4000',
            description: 'Description of product 1',
            price: 19.99,
            imageUrl: '',
        },
        {
            id: 2,
            title: 'SanDisk 128GB',
            description: 'Description of product 1',
            price: 19.99,
            imageUrl: '',
        },
    ];


    const filteredProducts = keyword
        ? products.filter(product => product.title.toLowerCase().includes(keyword.toLowerCase()))
        : products;



    return (
        <Fragment>
            <MetaData title={'Admin Home'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {auth.currentUser ? <Sidebar /> : null}
                </div>
                <div className="col-12 col-md-10">
                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="col-sm-12 col-md-6 col-lg-4 my-3">
                                    <div className="card p-3 rounded">
                                        <img className="card-img-top mx-auto" src={product.imageUrl} alt='' />
                                        <div className="card-body d-flex flex-column">
                                            <small className="card-title">
                                                <a href="#">{product.id}</a>
                                            </small>
                                            <h5 className="card-title">
                                                <a href="#">{product.title}</a>
                                            </h5>
                                            <h5 className="card-title">
                                                <a href="#">{product.description}</a>
                                            </h5>
                                            <p className="card-text">${product.price.toFixed(2)}</p>
                                            <a href="#" id="view_btn" className="btn btn-block">View Details</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </Fragment>
    );
};

export default Home;