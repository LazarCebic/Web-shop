import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import ProductSort, { sortProducts, filterBySize, getAvailableSizes } from "../common/ProductSort";
import ApiService from "../../service/ApiService";
import '../../style/home.css';


const Home = () => {
    const location = useLocation();
    const [allProducts, setAllProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('default');
    const [sizeFilter, setSizeFilter] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [error, setError] = useState(null);

    useEffect(()=> {

        const fetchProducts = async () => {
            try{
                let products = [];
                const queryparams = new URLSearchParams(location.search);
                const searchItem = queryparams.get('search')

                if (searchItem) {
                    const response = await ApiService.searchProducts(searchItem);
                    products = response.productList || [];
                }else{
                    const response = await ApiService.getAllProducts();
                    products = response.productList || [];

                }

                setAllProducts(products);
                setCurrentPage(1);

            }catch(error){
                setError(error.response?.data?.message || error.message || 'unable to fetch products')
            }
        }

        fetchProducts();

    },[location.search])

    // filtriranje po velicini i sortiranje se primenjuju na celu listu, pa se tek onda secka po stranicama
    const availableSizes = getAvailableSizes(allProducts);
    const filteredProducts = filterBySize(allProducts, sizeFilter);
    const sortedProducts = sortProducts(filteredProducts, sortBy);
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
                        facetLabel="Veličina"
                        facetOptions={availableSizes}
                        facetFilter={sizeFilter}
                        onFacetFilterChange={(value) => { setSizeFilter(value); setCurrentPage(1); }}
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

export default Home;