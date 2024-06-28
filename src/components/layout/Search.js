import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';

const Search = () => {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const database = getDatabase(); // Get your Firebase database reference

    useEffect(() => {
        const productsRef = ref(database, 'products');

        // Fetch all products once when component mounts
        onValue(productsRef, (snapshot) => {
            const productsData = snapshot.val();
            if (productsData) {
                const productNames = Object.values(productsData).map(product => product.productName);
                setSuggestions(productNames);
            }
        });
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