import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import '../../style/paymentResult.css';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { dispatch } = useCart();

    useEffect(() => {
        // brisemo korpu tek ovde — korisnik je zaista platio
        dispatch({ type: 'CLEAR_CART' });
        sessionStorage.removeItem('pendingOrderId');

        const fetchOrder = async () => {
            try {
                const response = await ApiService.verifyPayment(orderId);
                if (response.status === 200) {
                    setOrder(response.order);
                }
            } catch (error) {
                // ako porudzbina ne moze da se ucita, i dalje prikazujemo poruku o uspehu
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderId, dispatch]);

    return (
        <div className="payment-result-page payment-success">
            <h1>Plaćanje je uspešno izvršeno</h1>
            <p>Hvala na kupovini! Vaša porudžbina #{orderId} je primljena.</p>

            {!loading && order && (
                <div className="order-summary">
                    <h2>Pregled porudžbine</h2>
                    <p>Ukupna cena: {order.totalPrice?.toLocaleString('sr-RS')} RSD</p>
                    <ul>
                        {order.orderItemList?.map(item => (
                            <li key={item.id}>
                                {item.product?.name} x {item.quantity} — {item.price?.toLocaleString('sr-RS')} RSD
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Link to="/" className="back-home-button">Nastavi kupovinu</Link>
        </div>
    );
};

export default PaymentSuccessPage;
