import MetaData from '../layout/metaData';
import Loader from '../layout/Loader';
import React, { Fragment, useEffect, useState } from 'react';
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
                // Fetch a single product if ID is provided
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
                // Fetch all products
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
                    <MetaData title={id ? (product ? product.productName : 'Product Details') : 'Product Card'} />
                    {id ? (
                        <div className="row justify-content-around mt-5 user-info">
                            {product ? (
                                <div className="col-12 col-md-8">
                                    <div className="card p-3 rounded">
                                        <div className="thumbnail-images">
                                            {product.images.map((imageUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imageUrl}
                                                    style={{ height: 'auto', width: 'auto' }}
                                                    className="thumbnail"
                                                    alt={`Thumbnail ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">ID: {id}</p>
                                            <h5 className="card-title">Name: {product.productName}</h5>
                                            <p className="card-text">Category: {product.category}</p>
                                            <p className="card-text">Dimensions: {product.sizeX} x {product.sizeY} x {product.sizeZ}</p>
                                            <p className="card-text">Stock: {product.stock}</p>
                                            <p className="card-text">Material: {product.material}</p>
                                            <p className="card-text">Description: {product.description}</p>
                                            <p className="card-text">Seller: {product.seller}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Product not found</p>
                            )}
                        </div>
                    ) : (
                        <Fragment>
                            <h2 className="mt-5 ml-5">Product Details</h2>
                            <div className="row justify-content-around mt-5 user-info">
                                {products.map((product) => (
                                    <div key={product.id} className="col-sm-12 col-md-6 col-lg-4 my-3">
                                        <div className="card p-3 rounded">
                                            <div className="thumbnail-images">
                                                {product.images.map((imageUrl, index) => (
                                                    <img
                                                        key={index}
                                                        src={imageUrl}
                                                        style={{ height: 'auto', width: 'auto' }}
                                                        className="thumbnail"
                                                        alt={`Thumbnail ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="card-body">
                                                <p className="card-text">ID: {id}</p>
                                                <h5 className="card-title">Name: {product.productName}</h5>
                                                <p className="card-text">Category: {product.category}</p>
                                                <p className="card-text">Dimensions: {product.sizeX} x {product.sizeY} x {product.sizeZ}</p>
                                                <p className="card-text">Stock: {product.stock}</p>
                                                <p className="card-text">Material: {product.material}</p>
                                                <p className="card-text">Description: {product.description}</p>
                                                <p className="card-text">Seller: {product.seller}</p>
                                                <a href={`/product/${product.id}`} id="view_btn" className="btn btn-block">View Details</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductCard;
