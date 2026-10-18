import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminOrderPage.css'
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";


const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];


const AdminOrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps



    const fetchOrders = async () => {

        try {
            const response = await ApiService.getAllOrders();
            let orderList = response.orderList || [];

    setTotalPages(Math.ceil(orderList.length/itemsPerPage));
            setOrders(orderList);
            setFilteredOrders(orderList.slice((currentPage -1) * itemsPerPage, currentPage * itemsPerPage));


        } catch (error) {
            setError(error.response?.data?.message || error.message || 'unable to fetch orders')
            setTimeout(()=>{
                setError('')
            }, 3000)
        }
    }

    const handleFilterChange = (e) =>{
        const filterValue = e.target.value;
        setStatusFilter(filterValue)
        setCurrentPage(1);

        if (filterValue) {
            const filtered = orders.filter(order => order.status === filterValue);
            setFilteredOrders(filtered.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        }else{
            setFilteredOrders(orders.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(orders.length / itemsPerPage));
        }
    }


const handleOrderDetails = (orderId) => {
        navigate(`/admin/order-details/${orderId}`)
    }


    return (
        <div className="admin-orders-page">
            <h2>Porudžbine</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="filter-container">
                <div className="statusFilter">
                    <label>Filtriraj po statusu</label>
                    <select value={statusFilter} onChange={handleFilterChange}>
                        <option value="">Sve</option>
                        {OrderStatus.map(status=>(
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="orders-table">
                <thead>
                    <tr>
                        <th>ID porudžbine</th>
                        <th>Kupac</th>
                        <th>Adresa</th>
                        <th>Status</th>
                        <th>Cena</th>
                        <th>Datum porudžbine</th>
                        <th>Akcije</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user?.name}</td>
                            <td>{order.user?.address
                                ? [order.user.address.street, order.user.address.city, order.user.address.zipCode].filter(Boolean).join(', ')
                                : '-'}</td>
                            <td>{order.status}</td>
                            <td>{order.totalPrice?.toLocaleString('sr-RS')} RSD</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button onClick={()=> handleOrderDetails(order.id)}>Detalji</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page)=> setCurrentPage(page)}/>
        </div>
    )
}

export default AdminOrdersPage;