import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminProduct.css'
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";

const AdminProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;


    const fetchProducts = async() => {
        try {
            const response = await ApiService.getAllProducts();
            const productList = response.productList || [];
            setTotalPages(Math.ceil(productList.length/itemsPerPage));
            setProducts(productList.slice((currentPage -1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'unable to fetch products')
            
        }
    }

    useEffect(()=>{
        fetchProducts();
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleEdit = async (id) => {
        navigate(`/admin/edit-product/${id}`)
    }
    const handleDelete = async(id) => {
        const confirmed = window.confirm("Da li ste sigurni da želite da obrišete ovaj proizvod?")
        if(confirmed){
            try {
                await ApiService.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Greška pri brisanju proizvoda')
            }
        }
    }

    return(
        <div className="admin-product-list">
            {error ? (
                <p className="error-message">{error}</p>
            ): (
                <div>
                    <h2>Proizvodi</h2>
                    <button className="product-btn" onClick={()=> {navigate('/admin/add-product'); }}>Dodaj proizvod</button>
                    <ul>
                        {products.map((product)=>(
                            <li key={product.id}>
                                <span>{product.name}</span>
                                <button className="product-btn" onClick={()=> handleEdit(product.id)}>Izmeni</button>
                                <button className="product-btn-delete" onClick={()=> handleDelete(product.id)}>Obriši</button>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page)=> setCurrentPage(page)}/>
                </div>
            )}
        </div>
    )
}
export default AdminProductPage;