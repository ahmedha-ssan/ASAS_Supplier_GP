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
    const [color, setColor] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productRef = rtdbRef(database, `products/${productId}`);
                const productSnapshot = await get(productRef);

                if (productSnapshot.exists()) {
                    const productData = productSnapshot.val();
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
                        setColor(productData.color);
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

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!productName.trim()) {
            errors.productName = 'Product name is required';
            isValid = false;
        }

        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            errors.price = 'Price is required (must be a positive number)';
            isValid = false;
        }

        if (!stock || isNaN(stock) || parseInt(stock) < 0) {
            errors.stock = 'Stock is required(must be a positive number)';
            isValid = false;
        }

        if (!category.trim()) {
            errors.category = 'Category is required';
            isValid = false;
        }

        if (!description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        }

        if (!material.trim()) {
            errors.material = 'Material is required';
            isValid = false;
        }

        if (!seller.trim()) {
            errors.seller = 'Seller is required';
            isValid = false;
        }

        if (!sizeX || isNaN(sizeX) || parseFloat(sizeX) <= 0) {
            errors.sizeX = 'Size X is required (must be a positive number)';
            isValid = false;
        }

        if (!sizeY || isNaN(sizeY) || parseFloat(sizeY) <= 0) {
            errors.sizeY = 'Size Y is required (must be a positive number)';
            isValid = false;
        }

        if (!sizeZ || isNaN(sizeZ) || parseFloat(sizeZ) <= 0) {
            errors.sizeZ = 'Size Z is required (must be a positive number)';
            isValid = false;
        }

        if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
            errors.weight = 'Weight is required (must be a positive number)';
            isValid = false;
        }

        if (!color.trim()) {
            errors.color = 'Color is required';
            isValid = false;
        }

        setError(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);

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
                weight,
                color
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
                                {error.general && <div className="alert alert-danger">{error.general}</div>}

                                <div className="form-group">
                                    <label htmlFor="name_field">Product Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className={`form-control ${error.productName && 'is-invalid'}`}
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                    />
                                    {error.productName && <div className="invalid-feedback">{error.productName}</div>}


                                </div>
                                <div className="form-group">
                                    <label htmlFor="price_field">Price</label>
                                    <input
                                        type="number"
                                        id="price_field"
                                        className={`form-control ${error.price && 'is-invalid'}`}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                    {error.price && <div className="invalid-feedback">{error.price}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className={`form-control ${error.stock && 'is-invalid'}`}
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                    {error.stock && <div className="invalid-feedback">{error.stock}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <input
                                        type="text"
                                        id="category_field"
                                        className={`form-control ${error.category && 'is-invalid'}`}
                                        value={category}
                                        onChange={(e) => setcategory(e.target.value)}
                                    />
                                    {error.category && <div className="invalid-feedback">{error.category}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        className={`form-control ${error.description && 'is-invalid'}`}
                                        id="description_field"
                                        rows="8"
                                        value={description}
                                        onChange={(e) => setdescription(e.target.value)}
                                    />
                                    {error.description && <div className="invalid-feedback">{error.description}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="material_field">Material</label>
                                    <input
                                        type="text"
                                        id="material_field"
                                        className={`form-control ${error.material && 'is-invalid'}`}
                                        value={material}
                                        onChange={(e) => setmaterial(e.target.value)}
                                    />
                                    {error.material && <div className="invalid-feedback">{error.material}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="seller_field">Seller</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className={`form-control ${error.seller && 'is-invalid'}`}
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                    />
                                    {error.seller && <div className="invalid-feedback">{error.seller}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="sizeX_field">Size X</label>
                                    <input
                                        type="number"
                                        id="sizeX_field"
                                        className={`form-control ${error.sizeX && 'is-invalid'}`}
                                        value={sizeX}
                                        onChange={(e) => setsizeX(e.target.value)}
                                    />
                                    {error.sizeX && <div className="invalid-feedback">{error.sizeX}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="sizeY_field">Size Y</label>
                                    <input
                                        type="number"
                                        id="sizeY_field"
                                        className={`form-control ${error.sizeY && 'is-invalid'}`}
                                        value={sizeY}
                                        onChange={(e) => setsizeY(e.target.value)}
                                    />
                                    {error.sizeY && <div className="invalid-feedback">{error.sizeY}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="sizeZ_field">Size Z</label>
                                    <input
                                        type="number"
                                        id="sizeZ_field"
                                        className={`form-control ${error.sizeZ && 'is-invalid'}`}
                                        value={sizeZ}
                                        onChange={(e) => setsizeZ(e.target.value)}
                                    />
                                    {error.sizeZ && <div className="invalid-feedback">{error.sizeZ}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="weight_field">Weight</label>
                                    <input
                                        type="number"
                                        id="weight_field"
                                        className={`form-control ${error.weight && 'is-invalid'}`}
                                        value={weight}
                                        onChange={(e) => setweight(e.target.value)}
                                    />
                                    {error.weight && <div className="invalid-feedback">{error.weight}</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="weight_field">Color</label>
                                    <input
                                        type="text"
                                        id="weight_field"
                                        className={`form-control ${error.color && 'is-invalid'}`}
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                    {error.color && <div className="invalid-feedback">{error.color}</div>}

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
