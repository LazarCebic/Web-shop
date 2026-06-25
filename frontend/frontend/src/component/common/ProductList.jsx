import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import '../../style/productList.css';


const ProductList = ({products}) => {
    const {cart, dispatch} = useCart();
    // pending: { [productId]: quantity } — čuva količinu pre nego što korisnik potvrdi
    const [pending, setPending] = useState({});

    const incrementItem = (product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({type: 'DECREMENT_ITEM', payload: product});
        } else {
            dispatch({type: 'REMOVE_ITEM', payload: product});
        }
    }

    const decrementItem = (product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({type: 'DECREMENT_ITEM', payload: product});
        } else {
            dispatch({type: 'REMOVE_ITEM', payload: product});
        }
    }

    const confirmAddToCart = (product, qty) => {
        dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', payload: { ...product, quantity: qty } });
        setPending(prev => { const next = {...prev}; delete next[product.id]; return next; });
    };

    return(
        <div className="product-list">
                {products.map((product, index) => {
                    const cartItem = cart.find(item => item.id === product.id);
                    const pendingQty = pending[product.id];

                    return (
                        <div className="product-item" key={index}>
                            <Link to={`/product/${product.id}`}>
                                <img src={product.imageUrl} alt={product.name} className="product-image" />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <span>{product.price.toLocaleString('sr-RS')} RSD</span>
                            </Link>

                            {cartItem ? (
                                // Već u korpi — direktna promjena količine
                                <div className="quantity-controls">
                                    <button onClick={() => decrementItem(product)}>-</button>
                                    <span>{cartItem.quantity}</span>
                                    <button onClick={() => dispatch({type: 'INCREMENT_ITEM', payload: product})}>+</button>
                                </div>
                            ) : pendingQty !== undefined ? (
                                // Biranje količine — još nije u korpi
                                <div className="add-to-cart-selector">
                                    <div className="quantity-controls">
                                        <button onClick={() =>
                                            setPending(prev => ({...prev, [product.id]: Math.max(1, pendingQty - 1)}))
                                        }>-</button>
                                        <span>{pendingQty}</span>
                                        <button onClick={() => {
                                            if (pendingQty < (product.stockQuantity ?? 0)) {
                                                setPending(prev => ({...prev, [product.id]: pendingQty + 1}));
                                            }
                                        }}>+</button>
                                    </div>
                                    <button onClick={() => confirmAddToCart(product, pendingQty)}>
                                        Dodaj u korpu
                                    </button>
                                </div>
                            ) : (
                                // Početno stanje
                                <button
                                    disabled={(product.stockQuantity ?? 0) <= 0}
                                    onClick={() => setPending(prev => ({...prev, [product.id]: 1}))}
                                >
                                    {(product.stockQuantity ?? 0) <= 0 ? 'Nema na stanju' : 'Kupi'}
                                </button>
                            )}
                        </div>
                    )
                })}
        </div>
    )
};

export default ProductList;