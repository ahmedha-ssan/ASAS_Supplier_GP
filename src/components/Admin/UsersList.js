import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import Sidebar from './Sidebar';
import MetaData from '../layout/metaData';
import Loader from '../layout/Loader';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const currentUser = auth.currentUser;
                const supplierId = currentUser.uid;

                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(query(usersCollection, where('usertype', '==', 'delivery'), where('supplierId', '==', supplierId)));
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers(users.filter(user => user.id !== userId));
            alert.success('User deleted successfully');
        } catch (error) {
            alert.success('Error deleting user');
        }
    };

    const getUsersData = () => {
        const data = {
            columns: [
                { label: 'Name', field: 'name', sort: 'asc' },
                { label: 'Email', field: 'email', sort: 'asc' },
                { label: 'Phone Number', field: 'phoneNumber', sort: 'asc' },
                { label: 'Address', field: 'address', sort: 'asc' },
                { label: 'Actions', field: 'actions' },
            ],
            rows: []
        };

        users.forEach(user => {
            data.rows.push({
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                actions: (
                    <Fragment>
                        <Link to={`/admin/user/${user.id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteUser(user.id)}>
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
            <MetaData title={'All Delivery'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Delivery Men</h1>
                        {loading ? <Loader /> : (
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                        <th>Address</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getUsersData().rows.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phoneNumber}</td>
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
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default UsersList;