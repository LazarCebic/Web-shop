import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import ProductSort, {
    sortProducts,
    filterBySize, getAvailableSizes,
    filterByBrand, getAvailableBrands,
    filterByGenre, getAvailableGenres,
    filterBySportType, getAvailableSportTypes,
} from "../common/ProductSort";
import '../../style/home.css'


const CategoryProductsPage = () => {

    const { categoryId } = useParams();
    const [allProducts, setAllProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('default');
    const [facetFilter, setFacetFilter] = useState('');
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
            setFacetFilter('');
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'unable to fetch products by categoty id')
        }
    }

    // Vrsta filtera zavisi od kategorije: veličina ako proizvodi imaju veličinu (odeća, obuća),
    // žanr za knjige, tip za sport, a za sve ostalo (elektronika, aparati, laptopovi) brend.
    const hasSizes = allProducts.some(p => p.size);
    let facetType = 'brand';
    if (hasSizes) facetType = 'size';
    else if (String(categoryId) === '3') facetType = 'genre';
    else if (String(categoryId) === '4') facetType = 'sport';

    const FACETS = {
        size:  { label: 'Veličina', options: getAvailableSizes,      filter: filterBySize },
        genre: { label: 'Žanr',     options: getAvailableGenres,     filter: filterByGenre },
        sport: { label: 'Tip',      options: getAvailableSportTypes, filter: filterBySportType },
        brand: { label: 'Brend',    options: getAvailableBrands,     filter: filterByBrand },
    };
    const facet = FACETS[facetType];

    // filtriranje i sortiranje se primenjuju na celu listu, pa se tek onda secka po stranicama
    const facetOptions = facet.options(allProducts);
    const filteredProducts = facet.filter(allProducts, facetFilter);
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
                        facetLabel={facet.label}
                        facetOptions={facetOptions}
                        facetFilter={facetFilter}
                        onFacetFilterChange={(value) => { setFacetFilter(value); setCurrentPage(1); }}
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