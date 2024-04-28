import React, { Fragment } from 'react'
import MetaData from '../layout/metaData';
import Sidebar from './Sidebar'

const NewDelivery = () => {
    return (
        <Fragment>
            <MetaData title={'New Delivery'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" encType='multipart/form-data'>
                                <h1 className="mb-4">New Delivery</h1>

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
                                    <label for="name_field">ID</label>
                                    <input
                                        type="number"
                                        id="name_field"
                                        className="form-control"
                                        value=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="name_field">Phone Number</label>
                                    <input
                                        type="number"
                                        id="name_field"
                                        className="form-control"
                                        value=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="name_field">Email</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="name_field">Age</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="name_field">Address</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value=""
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="name_field">Password</label>
                                    <input
                                        type="text"
                                        id="name_field"
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
export default NewDelivery


