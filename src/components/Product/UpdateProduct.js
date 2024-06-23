import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref as rtdbRef, get, update } from 'firebase/database';
import { app, auth } from '../../firebase';
import MetaData from '../layout/metaData';
import Sidebar from '../layout/Sidebar';

const database = getDatabase(app);

const UpdateProduct = () => {
    const { productId } = useParams();
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setcategory] = useState('');
    const [description, setdescription] = useState('');
    const [material, setmaterial] = useState('');
    const [seller, setSeller] = useState('');
    const [sizeX, setsizeX] = useState('');
    const [sizeY, setsizeY] = useState('');
    const [sizeZ, setsizeZ] = useState('');
    const [weight, setweight] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productRef = rtdbRef(database, `products/${productId}`);
                const productSnapshot = await get(productRef);

                if (productSnapshot.exists()) {
                    const productData = productSnapshot.val();

                    // Get the current user's ID
                    const currentUserId = auth.currentUser.uid;

                    // Check if the product's userId matches the current user's ID
                    if (productData.userId === currentUserId) {
                        setProductName(productData.productName);
                        setPrice(productData.price);
                        setStock(productData.stock);
                        setcategory(productData.category);
                        setdescription(productData.description);
                        setmaterial(productData.material);
                        setSeller(productData.seller);
                        setsizeX(productData.sizeX);
                        setsizeY(productData.sizeY);
                        setsizeZ(productData.sizeZ);
                        setweight(productData.weight);
                        setLoading(false);
                    } else {
                        alert('You are not authorized to edit this product.');
                        navigate('/admin/products');
                    }
                    setLoading(false);
                } else {
                    setLoading(false);
                    alert('Product not found');
                    navigate('/admin/products');
                }
            } catch (error) {
                setLoading(false);
                alert(error.message);
            }
        };

        fetchProduct();
    }, [productId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productRef = rtdbRef(database, `products/${productId}`);
            await update(productRef, {
                productName,
                price,
                stock,
                category,
                description,
                material,
                seller,
                sizeX,
                sizeY,
                sizeZ,
                weight
            });
            setLoading(false);
            navigate('/admin/products');
            alert('Product updated successfully');
        } catch (error) {
            setLoading(false);
            alert(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Fragment>
            <MetaData title={'Update Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={handleSubmit}>
                                <h1 className="mb-4">Edit Product</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Product Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price_field">Price</label>
                                    <input
                                        type="number"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <input
                                        type="text"
                                        id="category_field"
                                        className="form-control"
                                        value={category}
                                        onChange={(e) => setcategory(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description_field"
                                        rows="8"
                                        value={description}
                                        onChange={(e) => setdescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="material_field">Material</label>
                                    <input
                                        type="text"
                                        id="material_field"
                                        className="form-control"
                                        value={material}
                                        onChange={(e) => setmaterial(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="seller_field">Seller</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className="form-control"
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="sizeX_field">Size X</label>
                                    <input
                                        type="number"
                                        id="sizeX_field"
                                        className="form-control"
                                        value={sizeX}
                                        onChange={(e) => setsizeX(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="sizeY_field">Size Y</label>
                                    <input
                                        type="number"
                                        id="sizeY_field"
                                        className="form-control"
                                        value={sizeY}
                                        onChange={(e) => setsizeY(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="sizeZ_field">Size Z</label>
                                    <input
                                        type="number"
                                        id="sizeZ_field"
                                        className="form-control"
                                        value={sizeZ}
                                        onChange={(e) => setsizeZ(e.target.value)}
                                        required
                                    />

                                </div>
                                <div className="form-group">
                                    <label htmlFor="weight_field">Weight</label>
                                    <input
                                        type="number"
                                        id="weight_field"
                                        className="form-control"
                                        value={weight}
                                        onChange={(e) => setweight(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateProduct;
