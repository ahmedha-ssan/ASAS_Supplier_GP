/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react'
import MetaData from '../layout/metaData';
import { ProgressBar } from 'react-bootstrap';
import Sidebar from './Sidebar'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as rtdbRef, push } from 'firebase/database';
import { app } from '../../firebase.js';

const storage = getStorage(app);
const database = getDatabase(app);

const NewProduct = () => {
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("select");
    const [downloadImageURLs, setDownloadImageURLs] = useState([]);
    // eslint-disable-next-line
    const [downloadModelURL, setDownloadModelURL] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    // eslint-disable-next-line
    const [totalUploadProgress, setTotalUploadProgress] = useState(0);

    const handleImageChange = (e) => {
        const files = e.target.files;
        const newImages = Array.from(files);
        setImages([...images, ...newImages]);

        const previewFiles = newImages.map((file) => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...previewFiles]);
    };

    const handleImageRemove = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviewImages = [...previewImages];
        newPreviewImages.splice(index, 1);
        setPreviewImages(newPreviewImages);
    };

    const handleModelChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedModel(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (images.length > 0 && selectedModel) {
            setUploadStatus("uploading");
            setTotalUploadProgress(0);

            const uploadImagePromises = images.map((file) => {
                const storageRef = ref(storage, 'your-images-folder/' + file.name);
                const uploadTask = uploadBytesResumable(storageRef, file);

                return new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(progress);
                            const totalProgress = ((progress + modelUploadProgress) / 2);
                            setTotalUploadProgress(totalProgress);
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
            let modelUploadProgress = 0;

            modelUploadTask.on(
                'state_changed',
                (snapshot) => {
                    modelUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(modelUploadProgress);
                    const totalProgress = ((uploadProgress + modelUploadProgress) / 2);
                    setTotalUploadProgress(totalProgress);
                },
                (error) => {
                    console.error(error);
                    setUploadStatus("select");
                },
                async () => {
                    const modelDownloadURL = await getDownloadURL(modelUploadTask.snapshot.ref);
                    setDownloadModelURL(modelDownloadURL);

                    // Save download URLs to Firebase Realtime Database
                    const imagesRef = rtdbRef(database, 'images');
                    downloadImageURLs.forEach((url) => {
                        push(imagesRef, url); // pushes each URL as a new child
                    });

                    const modelRef = rtdbRef(database, 'models');
                    push(modelRef, modelDownloadURL); // push model URL to database

                    // Clear inputs after successful upload
                    clearInputs();
                    setUploadStatus("done");
                }
            );

            try {
                const downloadImageURLs = await Promise.all(uploadImagePromises);
                setDownloadImageURLs(downloadImageURLs);
                setTotalUploadProgress(100);
            } catch (error) {
                console.error(error);
                setUploadStatus("select");
            }
        }
    };

    const clearInputs = () => {
        setImages([]);
        setPreviewImages([]);
        setSelectedModel(null);
        setDownloadImageURLs([]);
        setDownloadModelURL(null);
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
                                {uploadStatus === "uploading" && (
                                    <ProgressBar
                                        animated
                                        now={100}
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
                                        value=""
                                    />
                                </div>

                                <div className="form-group">
                                    <label for="price_field">Price</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="price_field">Material</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value=""
                                    />
                                </div>
                                <div className="form-group d-flex align-items-center">
                                    <label htmlFor="size_x" className="mr-1">Size X:</label>
                                    <input
                                        type="text"
                                        id="size_x"
                                        className="form-control mr-2"
                                        value=""
                                    />
                                    <label htmlFor="size_y" className="mr-1">Size Y:</label>
                                    <input
                                        type="text"
                                        id="size_y"
                                        className="form-control mr-2"
                                        value=""
                                    />
                                    <label htmlFor="size_z" className="mr-1">Size Z:</label>
                                    <input
                                        type="text"
                                        id="size_z"
                                        className="form-control"
                                        value=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="description_field">Description</label>
                                    <textarea className="form-control" id="description_field" rows="8" ></textarea>
                                </div>

                                <div className="form-group">
                                    <label for="category_field">Category</label>
                                    <select className="form-control" id="category_field">
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
                                        value=""
                                    />
                                </div>

                                <div className="form-group">
                                    <label for="seller_field">Seller Name</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className="form-control"
                                        value=""
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
                                            onChange={handleImageChange}
                                            multiple
                                        />
                                        <label className='custom-file-label' for='customFile'>
                                            Choose Images
                                        </label>

                                        <div className="uploaded-images" style={{ margin: '10px' }}>
                                            {previewImages.map((previewUrl, index) => (
                                                //old 
                                                //     <img key={index} src={previewUrl} className="img-fluid" style={{ width: '100px', height: 'auto', margin: '5px', borderRadius: '5px' }} alt={`Image ${index + 1}`} onClick={() => handleImageRemove(index)} />
                                                //
                                                <img key={index} src={previewUrl} className="img-fluid" style={{ width: '100px', height: 'auto', margin: '5px', borderRadius: '5px' }} alt={`Preview ${index + 1}`} onClick={() => handleImageRemove(index)} />

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
                                            id='customFile'
                                            onChange={handleModelChange}
                                        />
                                        <label className='custom-file-label' for='customFile'>
                                            Choose 3D Model
                                        </label>
                                    </div>
                                </div>
                                <button
                                    id="login_button"
                                    className="btn btn-block py-3"
                                    type='button'
                                    onClick={handleUpload}
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


