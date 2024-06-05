/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react';
import MetaData from '../layout/metaData';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as rtdbRef, push, set } from 'firebase/database';
import { app } from '../../firebase.js';
import { getAuth } from 'firebase/auth';

const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app);

const NewProduct = () => {
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [previewModel, setPreviewModel] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
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

    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);// Initialize loading state

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
        setLoading(true);
        if (images.length > 0 && selectedModel) {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                setUploadProgress(0);

                const uploadImagePromises = images.map((file) => {
                    const storageRef = ref(storage, 'your-images-folder/' + file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    return new Promise((resolve, reject) => {
                        uploadTask.on(
                            'state_changed',
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                setUploadProgress((prev) => prev + progress / images.length);
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
                        setUploadProgress((prev) => prev + progress / 2);
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
                        await set(newProductRef, {
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
                            seller,
                            images: downloadImageURLs,
                            model: modelDownloadURL,
                            userId // store the user ID with the product
                        });

                        clearInputs();
                        navigate('/admin/products');
                    }
                );
            }
        }
    };


    const clearInputs = () => {
        setImages([]);
        setPreviewImages([]);
        setSelectedModel(null);
        setProductName("");
        setPrice("");
        setMaterial("");
        setSizeX("");
        setSizeY("");
        setSizeZ("");
        setDescription("");
        setCategory("Electronics");
        setStock("");
        setweight("");
        setSeller("");
        setPreviewModel(null);
        setLoading(false);
        setUploadProgress(0);
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
                                {loading && (
                                    <ProgressBar
                                        animated
                                        now={uploadProgress}
                                        className=""
                                        style={{ width: '100%', borderRadius: '4px' }}
                                    />
                                )}
                                <h1 className="mb-4">New Product</h1>

                                <div className="form-group">
                                    <label for="name_field">Name</label>
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
                                    <label for="price_field">Price</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="price_field">Material</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={material}
                                        onChange={(e) => setMaterial(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="price_field">Weight</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={weight}
                                        onChange={(e) => setweight(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group d-flex align-items-center">
                                    <label htmlFor="size_x" className="mr-1">Size X:</label>
                                    <input
                                        type="text"
                                        id="size_x"
                                        className="form-control mr-2"
                                        value={sizeX}
                                        onChange={(e) => setSizeX(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="size_y" className="mr-1">Size Y:</label>
                                    <input
                                        type="text"
                                        id="size_y"
                                        className="form-control mr-2"
                                        value={sizeY}
                                        onChange={(e) => setSizeY(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="size_z" className="mr-1">Size Z:</label>
                                    <input
                                        type="text"
                                        id="size_z"
                                        className="form-control"
                                        value={sizeZ}
                                        onChange={(e) => setSizeZ(e.target.value)}
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
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <select
                                        className="form-control"
                                        id="category_field"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option>Electronics</option>
                                        <option>Home</option>
                                        <option>Others</option>

                                    </select>
                                </div>


                                <div className="form-group">
                                    <label for="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        required />
                                </div>

                                <div className="form-group">
                                    <label for="seller_field">Seller Name</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className="form-control"
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                        required
                                    />
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
                                            required
                                        />
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

                                <div className='form-group'>
                                    <label>3D Model</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customModelFile'
                                            // accept=".glb"
                                            onChange={handleModelChange}
                                            required
                                        />
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
                                <button
                                    id="login_button"
                                    className="btn btn-block py-3"
                                    type='button'
                                    onClick={handleUpload}
                                    disabled={loading}
                                >
                                    CREATE
                                </button>

                            </form>
                        </div> </Fragment>
                </div>
            </div>

        </Fragment>
    )
}
export default NewProduct


