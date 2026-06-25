import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/paymentResult.css';

const PaymentCancelledPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [cancelling, setCancelling] = useState(true);

    useEffect(() => {
        const cancelOrder = async () => {
            if (!orderId) { setCancelling(false); return; }
            try {
                // dohvatamo porudzbinu da dobijemo ID-eve svih stavki
                const response = await ApiService.getOrderById(orderId);
                const items = response.order?.orderItemList || [];
                // otkazujemo svaku stavku — backend automatski vraca kolicinu na stanje
                await Promise.all(
                    items.map(item => ApiService.updateOrderitemStatus(item.id, 'CANCELLED'))
                );
            } catch (e) {
                // ako nije moglo da se otkaže, ne prikazujemo grešku korisniku
            } finally {
                setCancelling(false);
            }
        };
        cancelOrder();
    }, [orderId]);

    return (
        <div className="payment-result-page payment-cancelled">
            <h1>Plaćanje je otkazano</h1>
            <p>
                {cancelling
                    ? "Otkazujemo porudžbinu..."
                    : "Vaša porudžbina je otkazana. Proizvodi su i dalje u korpi — možete pokušati ponovo."}
            </p>
            <Link to="/cart" className="back-home-button">Nazad u korpu</Link>
        </div>
    );
};

export default PaymentCancelledPage;
