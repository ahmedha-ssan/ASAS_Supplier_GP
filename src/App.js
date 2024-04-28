import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/HomePage/Home';

//Admin imports
import Dashboard from './components/Admin/Dashboard';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import NewDelivery from './components/Admin/NewDelivery';
import OrdersList from './components/Admin/OrderList';
import UsersList from './components/Admin/UsersList';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>

          </Routes>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/addproducts" element={<NewProduct />} />
          <Route path="/admin/adddelivery" element={<NewDelivery />} />
          <Route path="/admin/orders" element={<OrdersList />} />
          <Route path="/admin/users" element={<UsersList />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
