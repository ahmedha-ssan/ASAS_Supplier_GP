import React, { Fragment, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import MetaData from '../layout/metaData';
import Loader from '../layout/Loader';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, get } from 'firebase/database';

const ProductCard = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const database = getDatabase();
        const productsRef = ref(database, 'products');

        const fetchProducts = async () => {
            if (id) {
                const productRef = ref(database, `products/${id}`);
                try {
                    const snapshot = await get(productRef);
                    if (snapshot.exists()) {
                        setProduct(snapshot.val());
                    }
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            } else {
                onValue(productsRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const productsArray = Object.entries(data).map(([id, product]) => ({
                            id,
                            ...product
                        }));
                        setProducts(productsArray);
                    }
                });
            }
            setLoading(false);
        };

        fetchProducts();
    }, [id]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={id ? (product ? product.name : 'Product Details') : 'Product Card'} />
                    <div className="container container-fluid">
                        <div className="row f-flex justify-content-around">
                            <div className="col-12 col-lg-5 img-fluid" id="product_image">
                                <img src={product ? product.images[0] : ''} alt={product ? product.name : ''} height="450" width="500" />
                            </div>

                            <div className="col-12 col-lg-5 mt-5">
                                <h3>{product ? product.productName : ''}</h3>
                                <p id="product_id">Product ID : {product ? id : ''}</p>

                                <hr />

                                <div className="rating-outer">
                                    <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                                </div>

                                <span id="no_of_reviews">({product ? product.numOfReviews : ''} Reviews)</span>

                                <hr />

                                <p id="product_price">${product ? product.price : ''}</p>
                                <hr />

                                <p>Status: <span id="stock_status" className={product && product.stock > 0 ? 'greenColor' : 'redColor'}>{product && product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

                                <hr />

                                <h4 className="mt-2">Description:</h4>
                                <p>{product ? product.description : ''}</p>
                                <hr />
                                <p id="product_seller mb-3">Sold by: <strong>{product ? product.seller : ''}</strong></p>


                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductCard;