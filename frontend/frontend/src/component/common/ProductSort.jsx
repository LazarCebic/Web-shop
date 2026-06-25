import React from "react";
import '../../style/productSort.css';

/**
 * Opcije sortiranja proizvoda. "default" zadrzava redosled kakav vrati backend
 * (najnoviji prvi - sortirano po id DESC u ProductServiceImpl).
 */
export const SORT_OPTIONS = [
    { value: 'default', label: 'Najnovije' },
    { value: 'price-asc', label: 'Cena: rastuće' },
    { value: 'price-desc', label: 'Cena: opadajuće' },
    { value: 'name-asc', label: 'Naziv: A-Š' },
    { value: 'name-desc', label: 'Naziv: Š-A' },
];

/**
 * Vraca novi (sortiran) niz proizvoda na osnovu izabrane opcije.
 * Ne menja originalni niz.
 */
export const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name, 'sr'));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name, 'sr'));
        default:
            return sorted;
    }
};

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16];

const ProductSort = ({ sortBy, onSortChange, itemsPerPage, onItemsPerPageChange }) => {
    return (
        <div className="product-sort">
            <label htmlFor="sort-select">Sortiraj po: </label>
            <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
            >
                {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <label htmlFor="page-size-select">Prikaži: </label>
            <select
                id="page-size-select"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
                {PAGE_SIZE_OPTIONS.map(n => (
                    <option key={n} value={n}>{n} po stranici</option>
                ))}
            </select>
        </div>
    );
};

export default ProductSort;
