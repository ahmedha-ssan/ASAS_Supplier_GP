import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure this path is correct

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsersWithComments = async () => {
            setLoading(true);
            try {
                // Query to fetch users from 'users' collection
                const usersQuery = query(collection(db, 'users'));
                const usersSnapshot = await getDocs(usersQuery);

                // Map over each user and fetch their comments
                const usersList = await Promise.all(
                    usersSnapshot.docs.map(async userDoc => {
                        const userData = userDoc.data();
                        const userId = userDoc.id;

                        // Query to fetch comments from 'comment and reviews' sub-collection
                        const commentsQuery = query(collection(db, `users/${userId}/comment and reviews`));
                        const commentsSnapshot = await getDocs(commentsQuery);
                        const commentsList = commentsSnapshot.docs.map(commentDoc => ({
                            id: commentDoc.id,
                            ...commentDoc.data()
                        }));

                        return {
                            id: userId,
                            name: userData.name, // Assuming user document has a 'name' field
                            comments: commentsList
                        };
                    })
                );

                setUsers(usersList);
            } catch (error) {
                console.error('Error fetching users and comments:', error);
            }
            setLoading(false);
        };

        fetchUsersWithComments();
    }, []);

    return (
        <div>
            <h1>Users List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <p>Name: {user.id}</p>
                            <h3>Comments:</h3>
                            <ul>
                                {user.comments ? (
                                    user.comments.map((comment, index) => (
                                        <li key={index}>{comment.comment}</li>
                                    ))
                                ) : (
                                    <p>No comments available for this user.</p>
                                )}
                            </ul>
                            <br />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UsersList;
