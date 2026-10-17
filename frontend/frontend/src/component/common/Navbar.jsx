import React, {useState} from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";


const Navbar = () =>{

    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const { cart } = useCart();

    const isAdmin = ApiService.isAdmin();
    const isAuthenticated = ApiService.isAuthenticated();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const handleSearchChange =(e) => {
        setSearchValue(e.target.value);
    }

    const handleSearchSubmit = async (e) =>{
        e.preventDefault();
        navigate(`/?search=${searchValue}`)
    }

    const handleLogout = () => {
        const confirm = window.confirm("Da li ste sigurni da želite da se odjavite?");
        if(confirm){
            ApiService.logout();
            setTimeout(()=>{
                navigate('/login')
            }, 500);
        }
    }

    return(
        <nav className="navbar">
            <div className="navbar-inner">
                <NavLink to="/" className="navbar-brand">
                    <span className="navbar-brand-mark">W</span>
                    <span className="navbar-brand-text">Web Shop</span>
                </NavLink>

                <form className="navbar-search" onSubmit={handleSearchSubmit}>
                    <input type="text"
                    placeholder="Pretraži proizvode..."
                    value={searchValue}
                    onChange={handleSearchChange} />
                    <button type="submit" aria-label="Pretraži">Pretraži</button>
                </form>

                <div className="navbar-link">
                    <NavLink to="/" end>Početna</NavLink>
                    <NavLink to="/categories">Kategorije</NavLink>
                    {isAuthenticated && <NavLink to="/profile">Nalog</NavLink>}
                    {isAdmin && <NavLink to="/admin">Admin</NavLink>}
                    {!isAuthenticated && <NavLink to="/login">Prijava</NavLink>}
                    {isAuthenticated && <button type="button" className="navbar-logout" onClick={handleLogout}>Odjava</button>}
                    <NavLink to="/cart" className="navbar-cart">
                        Korpa
                        {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
                    </NavLink>
                </div>
            </div>
        </nav>
    );

};
export default Navbar;
