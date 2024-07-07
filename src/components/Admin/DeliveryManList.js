import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import Sidebar from '../layout/Sidebar';
import MetaData from '../layout/metaData';
import Loader from '../layout/Loader';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error("No authenticated user found.");
            }

            const usersQuery = query(
                collection(db, 'users'),
                where('usertype', '==', 'delivery'),
                where('supplierId', '==', currentUser.uid)
            );
            const usersSnapshot = await getDocs(usersQuery);
            const fetchedUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(fetchedUsers);
            setFilteredUsers(fetchedUsers); // Initialize filteredUsers with all fetched users
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const searchResult = users.filter(user => user.id.includes(search));
        setFilteredUsers(searchResult);
    };

    const renderUserRows = () => {
        return filteredUsers.map(user => (
            <tr key={user.id}>

                <td>{user.id}</td>

                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.city}</td>
                <td>{user.address}</td>
                <td>
                    <Link to={`/admin/user/${user.id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteUser(user.id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <Fragment>
            <MetaData title={'All Delivery'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Delivery Men</h1>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="userId_field">Enter User ID</label>
                                        <input
                                            type="text"
                                            id="userId_field"
                                            className="form-control"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        id="search_button"
                                        type="submit"
                                        className="btn btn-primary btn-block py-2"
                                    >
                                        SEARCH
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="table-responsive mt-5">
                            {loading ? (
                                <Loader />
                            ) : (
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>ID</th>

                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            <th>City</th>
                                            <th>Address</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>{renderUserRows()}</tbody>
                                </table>
                            )}
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default UsersList;
