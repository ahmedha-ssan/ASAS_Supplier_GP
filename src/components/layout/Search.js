import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from '../../firebase';

const Search = () => {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const database = getDatabase();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const userId = auth.currentUser.uid; // Get current user ID
                const productsRef = ref(database, 'products');

                onValue(productsRef, (snapshot) => {
                    const productsData = snapshot.val();
                    if (productsData) {
                        const filteredProducts = Object.values(productsData)
                            .filter(product => product.userId === userId) // Filter products by user ID
                            .map(product => product.productName);
                        setSuggestions(filteredProducts);
                    }
                });
            } catch (error) {
                console.error("Error fetching products: ", error);
            }
        };

        fetchProducts();
    }, [database]);


    const searchHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/search/${keyword}`); // Use navigate instead of history.push
        } else {
            navigate('/');
        }
    }


    const handleInputChange = (e) => {
        const input = e.target.value;
        setKeyword(input);

        // Filter products based on input and update suggestions
        const filteredSuggestions = suggestions.filter(
            suggestion => suggestion.toLowerCase().includes(input.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
    };

    return (
        <form onSubmit={searchHandler} autoComplete="off">
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    value={keyword}
                    onChange={handleInputChange}
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            {/* Display suggestions in a dropdown */}
            {keyword && (
                <ul className="list-group mt-2">
                    {suggestions.map((item, index) => (
                        <li key={index} className="list-group-item" onClick={() => setKeyword(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default Search;