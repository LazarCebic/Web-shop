import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../../style/adminOrderDetails.css'
import ApiService from "../../service/ApiService";

const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrderDetailsPage = () => {
    const { itemId } = useParams();
    const [order, setOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchOrderDetails(itemId);
    }, [itemId]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await ApiService.getOrderById(orderId);
            if (response.order) {
                setOrder(response.order);
                setSelectedStatus(response.order.status || '');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Greška pri učitavanju detalja');
        }
    }

    const handleSubmitStatusChange = async () => {
        try {
            await ApiService.updateOrderitemStatus(order.id, selectedStatus);
            setMessage('Status porudžbine je uspešno ažuriran');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Greška pri ažuriranju statusa');
        }
    }

    if (!order) {
        return (
            <div className="order-details-page">
                {message ? <p className="message">{message}</p> : <p>Učitavanje detalja porudžbine...</p>}
            </div>
        );
    }

    const user = order.user;

    return (
        <div className="order-details-page">
            {message && <div className="message">{message}</div>}
            <h2>Detalji porudžbine #{order.id}</h2>

            <div className="order-item-details">
                {/* Informacije o porudžbini */}
                <div className="info">
                    <h3>Informacije o porudžbini</h3>
                    <p><strong>ID porudžbine:</strong> {order.id}</p>
                    <p><strong>Ukupna cena:</strong> {order.totalPrice?.toLocaleString('sr-RS')} RSD</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Datum:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Informacije o kupcu */}
                {user && (
                    <div className="info">
                        <h3>Informacije o kupcu</h3>
                        <p><strong>Ime:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Telefon:</strong> {user.phoneNumber}</p>
                        <div className="info">
                            <h3>Adresa dostave</h3>
                            <p><strong>Država:</strong> {user.address?.country}</p>
                            <p><strong>Pokrajina:</strong> {user.address?.state}</p>
                            <p><strong>Grad:</strong> {user.address?.city}</p>
                            <p><strong>Ulica:</strong> {user.address?.street}</p>
                            <p><strong>Poštanski broj:</strong> {user.address?.zipCode}</p>
                        </div>
                    </div>
                )}

                {/* Promena statusa */}
                <div className="status-change">
                    <h4>Promeni status</h4>
                    <select
                        className="status-option"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        {OrderStatus.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <button className="update-status-button" onClick={handleSubmitStatusChange}>
                        Ažuriraj status
                    </button>
                </div>
            </div>

            {/* Lista stavki */}
            <h3>Stavke porudžbine</h3>
            {order.orderItemList?.map((item) => (
                <div key={item.id} className="order-item-details">
                    {item.product && (
                        <>
                            <img src={item.product.imageUrl} alt={item.product.name} style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 4}} />
                            <div className="info">
                                <p><strong>Naziv:</strong> {item.product.name}</p>
                                <p><strong>Opis:</strong> {item.product.description}</p>
                                <p><strong>Cena po komadu:</strong> {(item.price / item.quantity)?.toLocaleString('sr-RS')} RSD</p>
                            </div>
                        </>
                    )}
                    <div className="info">
                        <p><strong>Količina:</strong> {item.quantity}</p>
                        <p><strong>Ukupno:</strong> {item.price?.toLocaleString('sr-RS')} RSD</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AdminOrderDetailsPage;
