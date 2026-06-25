import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import '../../style/cart.css'

const CartPage = () => {
    const { cart, dispatch } = useCart();
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();


    const incrementItem = (product) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    }

    const decrementItem = (product) => {

        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);



    const handleCheckout = async () => {
        if (!ApiService.isAuthenticated()) {
            setMessage("Morate se prijaviti pre nego što nastavite sa naručivanjem.");
            setTimeout(() => {
                setMessage('')
                navigate("/login")
            }, 3000);
            return;
        }

        const orderItems = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const orderRequest = {
            totalPrice,
            items: orderItems,
        }

        try {
            const response = await ApiService.createOrder(orderRequest);

            if (response.status === 200) {
                const orderId = response.order?.id;

                // odmah pokrecemo Stripe Checkout Session za upravo kreiranu porudzbinu
                const checkoutResponse = await ApiService.createCheckoutSession(orderId);
                if (checkoutResponse.status === 200 && checkoutResponse.message) {
                    // korpu brisemo SAMO na stranici uspeha, ne ovde
                    // jer korisnik moze da odustane od placanja i vrati se
                    sessionStorage.setItem('pendingOrderId', orderId);
                    window.location.href = checkoutResponse.message;
                } else {
                    setMessage("Porudžbina je kreirana, ali plaćanje nije moglo da se pokrene.");
                }
            } else {
                setMessage(response.message)
                setTimeout(() => setMessage(''), 5000);
            }

        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Greška pri kreiranju porudžbine');
            setTimeout(() => {
                setMessage('')
            }, 3000);

        }

    };


    return (
        <div className="cart-page">
            <h1>Korpa</h1>
            {message && <p className="response-message">{message}</p>}

            {cart.length === 0 ? (
                <p>Vaša korpa je prazna</p>
            ) : (
                <div>
                    <ul>
                        {cart.map(item => (
                            <li key={item.id}>
                                <img src={item.imageUrl} alt={item.name} />
                                <div>
                                    <h2>{item.name}</h2>
                                    <p>{item.description}</p>
                                    <div className="quantity-controls">
                                        <button onClick={()=> decrementItem(item)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={()=> incrementItem(item)}>+</button>
                                        <button
                                            className="remove-item-btn"
                                            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item })}
                                            title="Ukloni iz korpe"
                                        >🗑</button>
                                    </div>
                                    <span>{item.price.toLocaleString('sr-RS')} RSD</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h2>Ukupno: {totalPrice.toLocaleString('sr-RS')} RSD</h2>
                    <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
                </div>
            )}
        </div>
    )
}

export default CartPage;
