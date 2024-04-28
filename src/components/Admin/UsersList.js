import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MetaData from '../layout/metaData';

const UsersList = () => {
    // Dummy users data
    const users = [
        { _id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin' },
        { _id: 2, name: 'User 2', email: 'user2@example.com', role: 'User' },
        // Add more dummy users as needed
    ];

    const setUsers = () => {
        const data = {
            columns: [
                { label: 'User ID', field: 'id', sort: 'asc' },
                { label: 'Name', field: 'name', sort: 'asc' },
                { label: 'Email', field: 'email', sort: 'asc' },
                { label: 'Role', field: 'role', sort: 'asc' },
                { label: 'Actions', field: 'actions' },
            ],
            rows: []
        };

        users.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: (
                    <Fragment>
                        {/* Modify link to user details */}
                        <Link to={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" >
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                )
            });
        });

        return data;
    };

    return (
        <Fragment>
            <MetaData title={'All Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Users</h1>
                        {/* Your loader or table component here */}
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {setUsers().rows.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.actions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default UsersList;