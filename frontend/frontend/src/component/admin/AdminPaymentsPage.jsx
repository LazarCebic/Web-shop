import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import '../../style/adminPayments.css';

const AdminPaymentsPage = () => {

    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await ApiService.getAllPayments();
            setPayments(response.paymentList || []);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch payments');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-payments-page">
            <h2>Transakcije (Stripe)</h2>
            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Učitavanje...</p>
            ) : payments.length === 0 ? (
                <p>Još nema izvršenih transakcija.</p>
            ) : (
                <table className="payments-table">
                    <thead>
                        <tr>
                            <th>ID transakcije</th>
                            <th>Kupac</th>
                            <th>Proizvodi</th>
                            <th>Iznos</th>
                            <th>Status</th>
                            <th>Stripe Session ID</th>
                            <th>Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.customerEmail}</td>
                                <td>
                                    <ul className="payment-items-list">
                                        {payment.order?.orderItemList?.map(item => (
                                            <li key={item.id}>
                                                {item.product?.name} — {item.quantity} x {item.product?.price?.toLocaleString('sr-RS')} RSD
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{payment.amount?.toLocaleString('sr-RS')} RSD</td>
                                <td>
                                    <span className={`payment-status status-${payment.status?.toLowerCase()}`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="session-id-cell">{payment.stripeSessionId}</td>
                                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPaymentsPage;
