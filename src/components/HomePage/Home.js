/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MetaData from '../layout/metaData';
import Sidebar from '../layout/Sidebar';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from '../../firebase';

// import 'rc-slider/assets/index.css';

const Home = () => {
    const { keyword } = useParams();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);



    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        const database = getDatabase();
        const productsRef = ref(database, 'products');

        const fetchProducts = () => {
            onValue(productsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const productsArray = Object.entries(data).map(([id, product]) => ({
                        id,
                        ...product
                    }));

                    // Filter products by current user's ID
                    const userProducts = productsArray.filter(product => product.userId === user.uid);
                    setProducts(userProducts);
                }
            });
        };

        fetchProducts();
    }, [user]);

    const filteredProducts = keyword
        ? products.filter(product => product.productName.toLowerCase().includes(keyword.toLowerCase()))
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
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </Fragment>
    );
};

const ProductCard = ({ product }) => {
    const [mainImage, setMainImage] = useState(product.images ? product.images[0] : 'placeholder.jpg');

    const handleThumbnailClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    return (
        <div className="col-sm-12 col-md-6 col-lg-4 my-3">
            <div className="card p-3 rounded">
                <img className="card-img-top mx-auto" src={mainImage} alt='' />
                <div className="thumbnail-images">
                    {product.images && product.images.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            className="thumbnail"
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => handleThumbnailClick(imageUrl)}
                        />
                    ))}
                </div>
                <div className="card-body d-flex flex-column">

                    <h3 className="card-title">
                        <a href={`/product/${product.id}`}>{product.productName}</a>
                    </h3>
                    <h5 className="card-title">
                        EGP: <a href={`/product/${product.id}`}>{product.price}</a>
                    </h5>
                    <h5 className="card-title">
                        Stock: <a href={`/product/${product.id}`}>{product.stock}</a>
                    </h5>
                    <div className="ratings mt-auto">
                        <div className="rating-outer">
                            <div className="rating-inner" style={{ width: `${(product.star / 5) * 100}%` }}></div>
                        </div>
                        <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                    </div>
                    <a href={`/product/${product.id}`} id="view_btn" className="btn btn-block">View Details</a>
                </div>
            </div>
        </div>
    );
};

export default Home;