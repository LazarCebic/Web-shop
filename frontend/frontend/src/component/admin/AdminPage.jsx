import React from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminPage.css'


const AdminPage = () => {
    const navigate = useNavigate();

    return(
        <div className="admin-page">
            <h1>Dobrodošli, Admin</h1>
            <button onClick={()=> navigate("/admin/categories")}>Upravljanje kategorijama</button>
            <button onClick={()=> navigate("/admin/products")}>Upravljanje proizvodima</button>
            <button onClick={()=> navigate("/admin/orders")}>Upravljanje porudžbinama</button>
            <button onClick={()=> navigate("/admin/payments")}>Pregled plaćanja</button>
        </div>
    )
}

export default AdminPage;