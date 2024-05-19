import React from 'react'
import { Link } from 'react-router-dom'
const Sidebar = () => {
    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    <li>
                        <Link to="/dashboard"><i className="fa fa-tachometer"></i> Dashboard</Link>
                    </li>
                    <li>
                        <a href="#productSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-product-hunt"></i> Products</a>
                        <ul className="collapse list-unstyled" id="productSubmenu">
                            <li>
                                <Link to="/admin/products"><i className="fa fa-clipboard-list"></i> All</Link>
                            </li>
                            <li>
                                <Link to="/admin/addproducts"><i className="fa fa-plus"></i> Create</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/admin/orders"><i className="fa fa-shopping-basket"></i> Orders</Link>
                    </li>
                    <li>
                        <a href="#deliverySubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-truck"></i> Delivery</a>
                        <ul className="collapse list-unstyled" id="deliverySubmenu">
                            <li>
                                <Link to="/admin/users"><i className="fa fa-clipboard-list"></i> Delivery Men</Link>
                            </li>

                            <li>
                                <Link to="/admin/adddelivery"><i className="fa fa-plus"></i> Delivery Man</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
