import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import '../../style/productDetailsPage.css';


const ProductDetailsPage = () => {

    const {productId} = useParams();
    const {cart, dispatch} = useCart();
    const [product, setProduct] = useState(null);
    const [stockMessage, setStockMessage] = useState('');
    const [pendingQty, setPendingQty] = useState(null); // null = nije odabrano, broj = bira se

    const cartItem = product ? cart.find(item => item.id === product.id) : null;

    useEffect(()=>{
        fetchProduct();
    }, [productId]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchProduct = async () => {
        try {
            const response = await ApiService.getProductById(productId);
            setProduct(response.product);
            
        } catch (error) {
            console.log(error.message || error)
        }
    }

    
    const startSelecting = () => {
        if ((product.stockQuantity ?? 0) <= 0) {
            setStockMessage("Proizvod trenutno nije na stanju");
            return;
        }
        setPendingQty(1);
        setStockMessage('');
    };

    const incrementPending = () => {
        if (pendingQty + 1 > (product.stockQuantity ?? 0)) {
            setStockMessage(`Dostupno je samo ${product.stockQuantity ?? 0} komada na stanju`);
            return;
        }
        setPendingQty(pendingQty + 1);
        setStockMessage('');
    };

    const decrementPending = () => {
        if (pendingQty > 1) setPendingQty(pendingQty - 1);
    };

    const confirmAddToCart = () => {
        dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', payload: { ...product, quantity: pendingQty } });
        setPendingQty(null);
        setStockMessage('');
    };

    const incrementItem = () => {
        if (product) {
            const currentQuantity = cartItem ? cartItem.quantity : 0;
            if (currentQuantity + 1 > (product.stockQuantity ?? 0)) {
                setStockMessage(`Dostupno je samo ${product.stockQuantity ?? 0} komada na stanju`);
                return;
            }
            dispatch({type: 'INCREMENT_ITEM', payload: product});
            setStockMessage('');
        }
    };

    const decrementItem = () => {
        if (product) {
            if (cartItem && cartItem.quantity > 1) {
                dispatch({type: 'DECREMENT_ITEM', payload: product});
            } else {
                dispatch({type: 'REMOVE_ITEM', payload: product});
            }
        }
    };

    if (!product) {
        return <p>Učitavanje detalja proizvoda...</p>
    }

    return(
        <div className="product-detail">
            <img src={product?.imageUrl} alt={product?.name} />
            <h1>{product?.name}</h1>
            <p>{product?.description}</p>
            <span>{product.price.toLocaleString('sr-RS')} RSD</span>
            <p className={`stock-info ${(product.stockQuantity ?? 0) <= 0 ? 'out-of-stock' : ''}`}>
                {(product.stockQuantity ?? 0) > 0
                    ? `Na stanju: ${product.stockQuantity}`
                    : 'Nema na stanju'}
            </p>
            {stockMessage && <p className="stock-warning">{stockMessage}</p>}
            {cartItem ? (
                // Već u korpi — direktna promjena količine
                <div className="quantity-controls">
                    <button onClick={decrementItem}>-</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={incrementItem}>+</button>
                </div>
            ) : pendingQty !== null ? (
                // Biranje količine — još nije u korpi
                <>
                    <div className="quantity-controls">
                        <button onClick={decrementPending}>-</button>
                        <span>{pendingQty}</span>
                        <button onClick={incrementPending}>+</button>
                    </div>
                    <button onClick={confirmAddToCart}>Dodaj u korpu</button>
                </>
            ) : (
                // Početno stanje
                <button onClick={startSelecting} disabled={(product.stockQuantity ?? 0) <= 0}>
                    Kupi
                </button>
            )}

        </div>
    )

}

export default ProductDetailsPage;