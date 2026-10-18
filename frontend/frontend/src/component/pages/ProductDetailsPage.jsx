import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import '../../style/productDetailsPage.css';


const ProductDetailsPage = () => {

    const {productId} = useParams();
    const {cart, dispatch} = useCart();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [stockMessage, setStockMessage] = useState('');
    const [pendingQty, setPendingQty] = useState(null); // null = nije odabrano, broj = bira se

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [reviewRating, setReviewRating] = useState('5');
    const [reviewContent, setReviewContent] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const [reviewError, setReviewError] = useState('');

    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();

    const cartItem = product ? cart.find(item => item.id === product.id) : null;

    useEffect(()=>{
        fetchProduct();
        fetchReviews();
        if (isAuthenticated) {
            ApiService.getLoggedInUserInfo()
                .then(res => setCurrentUserId(res.user?.id))
                .catch(() => {});
        }
    }, [productId]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchProduct = async () => {
        try {
            const response = await ApiService.getProductById(productId);
            setProduct(response.product);

        } catch (error) {
            console.log(error.message || error)
        }
    }

    const fetchReviews = async () => {
        try {
            const response = await ApiService.getReviewsByProduct(productId);
            setReviews(response.reviewList || []);
            setAverageRating(response.averageRating || null);
        } catch (error) {
            console.log(error.message || error)
        }
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewMessage('');
        setReviewError('');
        try {
            await ApiService.createReview(productId, Number(reviewRating), reviewContent);
            setReviewContent('');
            setReviewRating('5');
            setReviewMessage('Hvala na recenziji!');
            fetchReviews();
        } catch (error) {
            setReviewError(error.response?.data?.message || error.message || 'Greška pri slanju recenzije');
        }
    }

    const handleReviewDelete = async (reviewId) => {
        const confirmed = window.confirm("Da li ste sigurni da želite da obrišete ovu recenziju?");
        if (!confirmed) return;
        try {
            await ApiService.deleteReview(reviewId);
            fetchReviews();
        } catch (error) {
            setReviewError(error.response?.data?.message || error.message || 'Greška pri brisanju recenzije');
        }
    }

    
    const startSelecting = () => {
        if (!ApiService.isAuthenticated()) {
            navigate("/login");
            return;
        }
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
        <>
        <div className="product-detail">
            <img src={product?.imageUrl} alt={product?.name} />
            <h1>{product?.name}</h1>
            <p>{product?.description}</p>
            {averageRating != null && (
                <span className="product-rating-badge">
                    {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
                    {' '}{averageRating.toFixed(1)} ({reviews.length})
                </span>
            )}
            {product.size && <span className="product-size-badge">Veličina: {product.size}</span>}
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

        <div className="reviews-section">
            <h2>Ocene i recenzije</h2>

            {reviews.length === 0 ? (
                <p className="no-reviews">Ovaj proizvod još nema recenzija. Budite prvi koji će ga oceniti!</p>
            ) : (
                <ul className="reviews-list">
                    {reviews.map(review => (
                        <li key={review.id}>
                            <div className="review-header">
                                <span className="review-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                <span className="review-author">{review.userName}</span>
                                <span className="review-date">{new Date(review.createdAt).toLocaleDateString('sr-RS')}</span>
                            </div>
                            {review.content && <p className="review-content">{review.content}</p>}
                            {(review.userId === currentUserId || isAdmin) && (
                                <button className="review-delete-btn" onClick={() => handleReviewDelete(review.id)}>Obriši</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {isAuthenticated ? (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                    <h3>Ostavi ocenu</h3>
                    {reviewMessage && <p className="review-success">{reviewMessage}</p>}
                    {reviewError && <p className="review-error">{reviewError}</p>}

                    <label htmlFor="review-rating">Ocena:</label>
                    <select id="review-rating" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
                        <option value="5">5 - Odlično</option>
                        <option value="4">4 - Vrlo dobro</option>
                        <option value="3">3 - Dobro</option>
                        <option value="2">2 - Loše</option>
                        <option value="1">1 - Vrlo loše</option>
                    </select>

                    <label htmlFor="review-content">Komentar (opciono):</label>
                    <textarea
                        id="review-content"
                        placeholder="Podelite svoje iskustvo sa ovim proizvodom..."
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)} />

                    <button type="submit">Pošalji recenziju</button>
                </form>
            ) : (
                <p className="review-login-hint">Prijavite se da biste ostavili ocenu i recenziju.</p>
            )}
        </div>
        </>
    )

}

export default ProductDetailsPage;