import React, { Fragment, useEffect, useState } from 'react';
import MetaData from '../layout/metaData';
import Loader from '../layout/Loader';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import Sidebar from '../layout/Sidebar';
import { db } from '../../firebase'; // Ensure this path is correct
import { collection, query, getDocs } from 'firebase/firestore';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const database = getDatabase();
        const productRef = ref(database, `products/${id}`);

        const fetchProduct = async () => {
            try {
                const snapshot = await get(productRef);
                if (snapshot.exists()) {
                    setProduct(snapshot.val());
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchUsersWithComments = async () => {
            setLoading(true);
            try {
                // Query to fetch users from 'users' collection
                const usersQuery = query(collection(db, 'users'));
                const usersSnapshot = await getDocs(usersQuery);

                // Map over each user and fetch their comments
                const usersList = await Promise.all(
                    usersSnapshot.docs.map(async userDoc => {
                        const userData = userDoc.data();
                        const userId = userDoc.id;

                        // Query to fetch comments from 'comment and reviews' sub-collection
                        const commentsQuery = query(collection(db, `users/${userId}/comment and reviews`));
                        const commentsSnapshot = await getDocs(commentsQuery);
                        const commentsList = commentsSnapshot.docs.map(commentDoc => ({
                            id: commentDoc.id,
                            ...commentDoc.data()
                        }));

                        // Filter comments to include only those matching the product_id
                        const filteredComments = commentsList.filter(comment => comment.product_id === id);

                        return {
                            id: userId,
                            name: userData.name,
                            comments: filteredComments
                        };
                    })
                );

                setUsers(usersList);
            } catch (error) {
                console.error('Error fetching users and comments:', error);
            }
            setLoading(false);
        };

        fetchUsersWithComments();
    }, [id]);

    const handleThumbnailClick = (imageUrl) => {
        setProduct(prevProduct => ({ ...prevProduct, mainImage: imageUrl }));
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={product ? product.productName : 'Product Details'} />
                    <div className="row">
                        <div className="col-12 col-lg-2">
                            <Sidebar />
                        </div>
                        <div className="container container-fluid">
                            <div className="row f-flex justify-content-around">
                                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                                    {product && (
                                        <Fragment>
                                            <img src={product.mainImage ? product.mainImage : product.images[0]} alt={product.productName} height="450" width="500" />
                                            <div className="thumbnail-images">
                                                {product.images.map((imageUrl, index) => (
                                                    <img
                                                        key={index}
                                                        src={imageUrl}
                                                        className="thumbnail"
                                                        alt={`Thumbnail ${index + 1}`}
                                                        onClick={() => handleThumbnailClick(imageUrl)}
                                                    />
                                                ))}
                                            </div>
                                        </Fragment>
                                    )}
                                </div>
                                <div className="col-12 col-lg-5 mt-5">
                                    <h3>{product ? product.productName : ''}</h3>
                                    <p id="product_id">Product ID : {id}</p>
                                    <hr />
                                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                                    <hr />

                                    <div className="rating-outer">
                                        <div className="rating-inner" style={{ width: `${(product.star / 5) * 100}%` }}></div>
                                    </div>

                                    <span id="no_of_reviews">({product.commentCount} Reviews)</span>
                                    <hr />
                                    <p id="product_price">${product.price}</p>
                                    <hr />
                                    <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'} </span> ({product.stock})</p>
                                    <hr />
                                    <h4 className="mt-2">Color:</h4>
                                    <p>{product.color}</p>
                                    <hr />

                                    <h4 className="mt-2">Description:</h4>
                                    <p>{product.description}</p>
                                    <hr />

                                    <div className="row mt-5">
                                        <div className="col-12 col-lg-8">
                                            <h3>Reviews</h3>
                                        </div>
                                        {users.map(user => (
                                            <div key={user.id}>
                                                {user.comments.length > 0 && (
                                                    user.comments.map((comment, index) => (
                                                        <p key={index}> {user.id}: {comment.comment} </p>
                                                    ))
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
