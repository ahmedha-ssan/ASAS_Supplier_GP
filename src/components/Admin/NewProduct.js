import React, { Fragment } from 'react'
import MetaData from '../layout/metaData';
import Sidebar from './Sidebar'

const NewProduct = () => {
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
                            <form className="shadow-lg" encType='multipart/form-data'>
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
                                            multiple
                                        />
                                        <label className='custom-file-label' for='customFile'>
                                            Choose Images
                                        </label>
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
                                            multiple
                                        />
                                        <label className='custom-file-label' for='customFile'>
                                            Choose 3D Model
                                        </label>
                                    </div>
                                </div>
                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
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


