import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import ProductSort, { sortProducts } from "../common/ProductSort";
import '../../style/home.css'


const CategoryProductsPage = () => {

    const { categoryId } = useParams();
    const [allProducts, setAllProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('default');
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [error, setError] = useState(null);


    useEffect(() => {
        fetchProducts();
    }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchProducts = async () => {
        try {

            const response = await ApiService.getAllProductsByCategoryId(categoryId);
            setAllProducts(response.productList || []);
            setCurrentPage(1);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'unable to fetch products by categoty id')
        }
    }

    // sortiranje se primenjuje na celu listu, pa se tek onda secka po stranicama
    const sortedProducts = sortProducts(allProducts, sortBy);
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const products = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    return(
        <div className="home">
            {error ? (
                <p className="error-message">{error}</p>
            ):(
                <div>
                    <ProductSort
                        sortBy={sortBy}
                        onSortChange={(value) => { setSortBy(value); setCurrentPage(1); }}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(value) => { setItemsPerPage(value); setCurrentPage(1); }}
                    />
                    <ProductList products={products}/>
                    <Pagination  currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page)=> setCurrentPage(page)}/>
                </div>
            )}
        </div>
    )
}
export default CategoryProductsPage;