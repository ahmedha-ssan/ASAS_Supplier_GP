import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as rtdbRef, push, set } from 'firebase/database';
import { app } from '../../firebase.js';
import { getAuth } from 'firebase/auth';
import Sidebar from '../layout/Sidebar.js';
import MetaData from '../layout/metaData.js';

const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app);

const AddProduct = () => {
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [previewModel, setPreviewModel] = useState(null);
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [material, setMaterial] = useState("");
    const [sizeX, setSizeX] = useState("");
    const [sizeY, setSizeY] = useState("");
    const [sizeZ, setSizeZ] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Electronics");
    const [stock, setStock] = useState("");
    const [seller, setSeller] = useState("");
    const [weight, setweight] = useState("");
    const [color, setColor] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageUploadProgress, setImageUploadProgress] = useState([]); // Tracks each image upload progress
    const [modelUploadProgress, setModelUploadProgress] = useState(0);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
        const previewFiles = files.map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...previewFiles]);
    };

    const handleImageRemove = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        const newPreviewImages = previewImages.filter((_, i) => i !== index);
        setPreviewImages(newPreviewImages);
    };

    const handleModelChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedModel(event.target.files[0]);
            setPreviewModel(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleUpload = async () => {
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        if (images.length > 0 && selectedModel) {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;

                const uploadImagePromises = images.map((file, index) => {
                    const storageRef = ref(storage, 'your-images-folder/' + file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    return new Promise((resolve, reject) => {
                        uploadTask.on(
                            'state_changed',
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                setImageUploadProgress((prev) => {
                                    const newProgress = [...prev];
                                    newProgress[index] = progress;
                                    return newProgress;
                                });
                                const totalProgress = (
                                    imageUploadProgress.reduce((a, b) => a + b, 0) + modelUploadProgress
                                ) / (images.length + 1); // +1 for model
                                setUploadProgress(totalProgress);
                            },
                            reject,
                            async () => {
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                resolve(downloadURL);
                            }
                        );
                    });
                });
                const modelStorageRef = ref(storage, 'your-3d-models-folder/' + selectedModel.name);
                const modelUploadTask = uploadBytesResumable(modelStorageRef, selectedModel);
                modelUploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setModelUploadProgress(progress);
                        const totalProgress = (
                            imageUploadProgress.reduce((a, b) => a + b, 0) + progress
                        ) / (images.length + 1); // +1 for model
                        setUploadProgress(totalProgress);
                    },
                    (error) => {
                        console.error(error);
                        setLoading(false);
                    },
                    async () => {
                        const modelDownloadURL = await getDownloadURL(modelUploadTask.snapshot.ref);
                        const downloadImageURLs = await Promise.all(uploadImagePromises);
                        // Save product data to Firebase Realtime Database
                        const productsRef = rtdbRef(database, 'products');
                        const newProductRef = push(productsRef);
                        const id = newProductRef.key;
                        await set(newProductRef, {
                            id,
                            productName,
                            price,
                            material,
                            sizeX,
                            sizeY,
                            sizeZ,
                            description,
                            category,
                            stock,
                            weight,
                            color,
                            seller,
                            images: downloadImageURLs,
                            model: modelDownloadURL,
                            userId
                        });
                        if (uploadProgress === 100) {
                            setUploadProgress(0);
                            setImageUploadProgress([]);
                            setModelUploadProgress(0);
                        }
                        clearInputs();
                        navigate('/admin/products');
                    }
                );
            }
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (!productName.trim()) {
            errors.productName = 'Product Name is required.';
            isValid = false;
        }

        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            errors.price = 'Price is required (must be a positive number).';
            isValid = false;
        }

        if (!material.trim()) {
            errors.material = 'Material is required.';
            isValid = false;
        }

        if (!sizeX || isNaN(sizeX) || parseFloat(sizeX) < 0) {
            errors.sizeX = 'Size X is required (must be a positive number).';
            isValid = false;
        }

        if (!sizeY || isNaN(sizeY) || parseFloat(sizeY) < 0) {
            errors.sizeY = 'Size Y is required (must be a positive number).';
            isValid = false;
        }

        if (!sizeZ || isNaN(sizeZ) || parseFloat(sizeZ) < 0) {
            errors.sizeZ = 'Size Z is required (must be a positive number).';
            isValid = false;
        }

        if (!description.trim()) {
            errors.description = 'Description is required.';
            isValid = false;
        }

        if (!stock || isNaN(stock) || parseInt(stock) < 0) {
            errors.stock = 'Stock is required (must be a positive number).';
            isValid = false;
        }

        if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
            errors.weight = 'Weight is required (must be a positive number).';
            isValid = false;
        }

        if (!color.trim()) {
            errors.color = 'Color is required.';
            isValid = false;
        }

        if (!seller.trim()) {
            errors.seller = 'Seller Name is required.';
            isValid = false;
        }

        if (images.length === 0) {
            errors.images = 'Images are required.';
            isValid = false;
        }

        if (!selectedModel) {
            errors.model = '3D Model is required.';
            isValid = false;
        }

        setError(errors);
        return isValid;
    };


    const clearInputs = () => {
        setImages([]);
        setPreviewImages([]);
        setSelectedModel(null);
        setProductName("");
        setPrice(0);
        setMaterial("");
        setSizeX("");
        setSizeY("");
        setSizeZ("");
        setDescription("");
        setCategory("Electronics");
        setStock("");
        setweight("");
        setSeller("");
        setColor("");
        setPreviewModel(null);
        setLoading(false);
        setUploadProgress(0);
        setError('');
    };


    return (
        <Fragment>
            <MetaData title={'New Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg">

                                <h1 className="mb-4">New Product</h1>
                                {error.general && <div className="alert alert-danger">{error.general}</div>}

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
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
                                        type="text"
                                        id="price_field"
                                        className={`form-control ${error.price && 'is-invalid'}`}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                    {error.price && <div className="invalid-feedback">{error.price}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="material_field">Material</label>
                                    <input
                                        type="text"
                                        id="material_field"
                                        className={`form-control ${error.material && 'is-invalid'}`}
                                        value={material}
                                        onChange={(e) => setMaterial(e.target.value)}
                                    />
                                    {error.material && <div className="invalid-feedback">{error.material}</div>}
                                </div>

                                <div className="form-group">
                                    <label for="price_field">Weight</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className={`form-control ${error.weight && 'is-invalid'}`}
                                        value={weight}
                                        onChange={(e) => setweight(e.target.value)}
                                    />
                                    {error.weight && <div className="invalid-feedback">{error.weight}</div>}
                                </div>

                                <div className="form-group">
                                    <label for="price_field">Color</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className={`form-control ${error.color && 'is-invalid'}`}
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                    {error.color && <div className="invalid-feedback">{error.material}</div>}

                                </div>

                                <div className="form-group d-flex align-items-center">
                                    <label htmlFor="size_x" className="mr-1">Size X:</label>
                                    <input
                                        type="text"
                                        id="size_x"
                                        className={`form-control mr-2 ${error.sizeX && 'is-invalid'}`}
                                        value={sizeX}
                                        onChange={(e) => setSizeX(e.target.value)}
                                    />
                                    {error.sizeX && <div className="invalid-feedback">{error.sizeX}</div>}

                                    <label htmlFor="size_y" className="mr-1">Size Y:</label>
                                    <input
                                        type="text"
                                        id="size_y"
                                        className={`form-control mr-2 ${error.sizeY && 'is-invalid'}`}
                                        value={sizeY}
                                        onChange={(e) => setSizeY(e.target.value)}
                                    />
                                    {error.sizeY && <div className="invalid-feedback">{error.sizeY}</div>}

                                    <label htmlFor="size_z" className="mr-1">Size Z:</label>
                                    <input
                                        type="text"
                                        id="size_z"
                                        className={`form-control mr-2 ${error.sizeZ && 'is-invalid'}`}
                                        value={sizeZ}
                                        onChange={(e) => setSizeZ(e.target.value)}
                                    />
                                    {error.sizeZ && <div className="invalid-feedback">{error.sizeZ}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        className={`form-control ${error.description && 'is-invalid'}`}
                                        id="description_field"
                                        rows="2"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    {error.description && <div className="invalid-feedback">{error.description}</div>}

                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <select
                                        id="category_field"
                                        className="form-control"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="Furniture">Furniture</option>
                                        <option value="Decoration">Decoration</option>
                                        <option value="Office">Office</option>
                                        <option value="Ligthing">Ligthing</option>
                                    </select>
                                </div>


                                <div className="form-group"> 
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="text"
                                        id="stock_field"
                                        className={`form-control ${error.stock && 'is-invalid'}`}
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                    {error.stock && <div className="invalid-feedback">{error.stock}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="seller_field">Seller Name</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className={`form-control ${error.seller && 'is-invalid'}`}
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                    />
                                    {error.seller && <div className="invalid-feedback">{error.seller}</div>}
                                </div>
                                <div className='form-group'>
                                    <label>3D Model</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customModelFile'
                                            accept=".glb"
                                            onChange={handleModelChange}
                                        />
                                        {error.model && <div className="invalid-feedback d-block">{error.model}</div>}

                                        <label className='custom-file-label' for='customModelFile'>
                                            Choose 3D Model
                                        </label>
                                    </div>
                                    {previewModel && (
                                        <div className="uploaded-model" style={{ margin: '10px' }}>
                                            <p>Selected 3D Model: {selectedModel.name}</p>
                                        </div>
                                    )}
                                </div>
                                <div className='form-group'>
                                    <label>Images</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customFile'
                                            accept=".png, .jpg"
                                            onChange={handleImageChange}
                                            multiple
                                        />
                                        {error.images && <div className="invalid-feedback d-block">{error.images}</div>}

                                        <label className='custom-file-label' for='customFile'>
                                            Choose Images
                                        </label>

                                        <div className="uploaded-images" style={{ margin: '10px' }}>
                                            {previewImages.map((previewUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={previewUrl}
                                                    className="img-fluid"
                                                    style={{ width: '100px', height: 'auto', margin: '5px', borderRadius: '5px' }}
                                                    alt={`Preview ${index + 1}`}
                                                    onClick={() => handleImageRemove(index)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>


                                <button
                                    id="login_button"
                                    className="btn btn-block py-3"
                                    type='button'
                                    onClick={handleUpload}
                                    disabled={loading}
                                >
                                    CREATE
                                </button>
                                <br />
                                {loading && (
                                    <ProgressBar
                                        animated
                                        now={uploadProgress}
                                        label={`${Math.round(uploadProgress)}%`}
                                        className=""
                                        style={{ width: '100%', borderRadius: '4px' }}
                                    />
                                )}
                            </form>
                        </div> </Fragment>
                </div>
            </div>

        </Fragment>
    )
}
export default AddProduct


