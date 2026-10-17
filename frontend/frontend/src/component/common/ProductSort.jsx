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
 * Vraca listu jedinstvenih velicina koje postoje medju prosledjenim proizvodima
 * (koristi se za popunjavanje filtera po velicini — relevantno npr. za odecu i obucu).
 */
export const getAvailableSizes = (products) => {
    const sizes = new Set();
    products.forEach(p => { if (p.size) sizes.add(p.size); });
    return Array.from(sizes).sort((a, b) => a.localeCompare(b, 'sr', { numeric: true }));
};

/**
 * Filtrira proizvode po izabranoj velicini. Prazna vrednost ("") vraca sve proizvode.
 */
export const filterBySize = (products, size) => {
    if (!size) return products;
    return products.filter(p => p.size === size);
};

/**
 * Prepoznavanje brenda iz naziva proizvoda (za Elektroniku, Kucne aparate, Laptopove).
 * Prvi pogodak iz liste pobedjuje - redosled je bitan (npr. iPhone pre opsteg "apple").
 */
const BRAND_PATTERNS = [
    [/iphone/i, 'Apple'], [/apple/i, 'Apple'], [/samsung/i, 'Samsung'], [/sony/i, 'Sony'],
    [/xiaomi/i, 'Xiaomi'], [/philips/i, 'Philips'], [/bosch/i, 'Bosch'], [/dyson/i, 'Dyson'],
    [/nespresso/i, 'Nespresso'], [/tefal/i, 'Tefal'], [/huawei/i, 'Huawei'], [/microsoft/i, 'Microsoft'],
    [/acer/i, 'Acer'], [/lenovo/i, 'Lenovo'], [/asus/i, 'ASUS'], [/\bhp\b/i, 'HP'], [/dell/i, 'Dell'],
    [/dji/i, 'DJI'], [/logitech/i, 'Logitech'], [/anker/i, 'Anker'], [/jbl/i, 'JBL'],
    [/everlast/i, 'Everlast'], [/wilson/i, 'Wilson'], [/nike/i, 'Nike'], [/kettler/i, 'Kettler'],
    [/columbia/i, 'Columbia'], [/wrangler/i, 'Wrangler'], [/adidas/i, 'Adidas'], [/puma/i, 'Puma'],
    [/north face/i, 'The North Face'], [/converse/i, 'Converse'], [/levis|levi.?s/i, "Levi's"],
];

export const getProductBrand = (name = '') => {
    const match = BRAND_PATTERNS.find(([pattern]) => pattern.test(name));
    return match ? match[1] : 'Ostalo';
};

export const getAvailableBrands = (products) => {
    const brands = new Set(products.map(p => getProductBrand(p.name)));
    return Array.from(brands).sort((a, b) => a.localeCompare(b, 'sr'));
};

export const filterByBrand = (products, brand) => {
    if (!brand) return products;
    return products.filter(p => getProductBrand(p.name) === brand);
};

/** Zanr knjiga - staticka mapa, jer se ne cuva kao posebno polje u bazi. */
const BOOK_GENRES = {
    'Igra prestola': 'Fantastika',
    'Da Vincijev kod': 'Triler',
    'Hari Poter i Kamen mudrosti': 'Fantastika',
    'Sapiens: Kratka istorija covecanstva': 'Publicistika',
    'Na Drini cuprija': 'Klasika',
    '1984': 'Distopija',
    'Mali Princ': 'Klasika',
    'Zivotinjska farma': 'Distopija',
    'Atomske navike': 'Publicistika',
    'Veliki Getsbi': 'Roman',
};

export const getBookGenre = (name) => BOOK_GENRES[name] || 'Ostalo';

export const getAvailableGenres = (products) => {
    const genres = new Set(products.map(p => getBookGenre(p.name)));
    return Array.from(genres).sort((a, b) => a.localeCompare(b, 'sr'));
};

export const filterByGenre = (products, genre) => {
    if (!genre) return products;
    return products.filter(p => getBookGenre(p.name) === genre);
};

/** Tip sportske opreme - staticka mapa iz istog razloga kao zanr knjiga. */
const SPORT_TYPES = {
    'Sator za kampovanje 4-osobe': 'Kampovanje',
    'Bokserske rukavice Everlast': 'Borilački sportovi',
    'Ranac za planinarenje': 'Kampovanje',
    'Wilson reket za tenis': 'Tenis',
    'Lopta za fudbal Nike': 'Timski sportovi',
    'Uze za preskakanje': 'Fitnes',
    'Traka za trcanje': 'Fitnes',
    'Bucice set': 'Fitnes',
    'Yoga prostirka': 'Fitnes',
    'Spinning bicikl': 'Fitnes',
};

export const getSportType = (name) => SPORT_TYPES[name] || 'Ostalo';

export const getAvailableSportTypes = (products) => {
    const types = new Set(products.map(p => getSportType(p.name)));
    return Array.from(types).sort((a, b) => a.localeCompare(b, 'sr'));
};

export const filterBySportType = (products, type) => {
    if (!type) return products;
    return products.filter(p => getSportType(p.name) === type);
};

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

const ProductSort = ({ sortBy, onSortChange, itemsPerPage, onItemsPerPageChange, facetLabel, facetOptions, facetFilter, onFacetFilterChange }) => {
    return (
        <div className="product-sort">
            {facetOptions && facetOptions.length > 1 && (
                <>
                    <label htmlFor="facet-select">{facetLabel}: </label>
                    <select
                        id="facet-select"
                        value={facetFilter}
                        onChange={(e) => onFacetFilterChange(e.target.value)}
                    >
                        <option value="">Sve ({facetLabel?.toLowerCase()})</option>
                        {facetOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </>
            )}

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
