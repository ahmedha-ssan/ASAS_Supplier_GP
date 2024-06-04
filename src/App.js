import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { auth } from './firebase'

import Login from './components/Admin/Login'
import Register from './components/Admin/Register'

//Admin imports
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/HomePage/Home';
import Dashboard from './components/Admin/Dashboard';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import NewDelivery from './components/Admin/NewDelivery';
import OrdersList from './components/Admin/OrderList';
import UsersList from './components/Admin/UsersList';
import ForgotPassword from './components/Admin/ForgotPassword'
import UpdateUser from './components/Admin/UpdateUser';
import Profile from './components/Admin/Profile';
import UpdateProfile from './components/Admin/UpdateProfile'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    auth.signOut();
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <div className="container container-fluid">
          <Routes>

          </Routes>
        </div>
        <Routes>
          {/* Public routes accessible to anyone */}
          {isLoggedIn ? (
            <Route path="/" element={<Navigate to="/Home" />} />
          ) : (
            <Route path="/" element={<Home />} />
          )}
          {isLoggedIn ? (
            <Route path="/Login" element={<Navigate to="/dashboard" />} />
          ) : (
            <Route path="/Login" element={<Login />} />
          )}
          {isLoggedIn ? (
            <Route path="/Register" element={<Navigate to="/dashboard" />} />
          ) : (
            <Route path="/Register" element={<Register />} />
          )}
          {isLoggedIn ? (
            <Route path="/password/forgot" element={<Navigate to="/dashboard" />} />
          ) : (
            <Route path="/password/forgot" element={<ForgotPassword />} />
          )}
          {/*  */}
          {/* Private routes accessible only if logged in */}
          {isLoggedIn && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/addproducts" element={<NewProduct />} />
              <Route path="/admin/adddelivery" element={<NewDelivery />} />
              <Route path="/admin/orders" element={<OrdersList />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/user/:userId" element={<UpdateUser />} />
              <Route path="/me" element={<Profile />} />
              <Route path="/me/update" element={<UpdateProfile />} />

            </>
          )}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
