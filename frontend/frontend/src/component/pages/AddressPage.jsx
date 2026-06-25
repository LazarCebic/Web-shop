import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/address.css';

const AddressPage = () => {

    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {

        if (location.pathname === '/edit-address') {
            fetchUserInfo();
        }
    }, [location.pathname]);


    const fetchUserInfo = async()=>{
        try {
            const response = await ApiService.getLoggedInUserInfo();
            if (response.user.address) {
                setAddress(response.user.address)
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Greška pri učitavanju podataka")
        }
    } ;

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value
        }))
    }

    const validate = () => {
        const newErrors = {};
        if (!address.street.trim()) newErrors.street = "Ulica je obavezna";
        if (!address.city.trim()) newErrors.city = "Grad je obavezan";
        if (!address.state.trim()) newErrors.state = "Država/region je obavezan";
        if (!address.zipCode.trim()) {
            newErrors.zipCode = "Poštanski broj je obavezan";
        } else if (!/^[0-9A-Za-z\s-]{3,10}$/.test(address.zipCode)) {
            newErrors.zipCode = "Unesite ispravan poštanski broj";
        }
        if (!address.country.trim()) newErrors.country = "Zemlja je obavezna";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handSubmit = async (e) =>{
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            await ApiService.saveAddress(address);
            navigate("/profile")
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Greška pri čuvanju adrese")
        }
    }


    return(
        <div className="address-page">
            <h2>{location.pathname === '/edit-address' ? 'Izmeni adresu' : "Dodaj adresu"}</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handSubmit}>
                <label>
                    Ulica:
                    <input type="text"
                    name="street"
                    value={address.street}
                    onChange={handleChange}/>
                </label>
                {errors.street && <span className="field-error">{errors.street}</span>}

                <label>
                    Grad:
                    <input type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}/>
                </label>
                {errors.city && <span className="field-error">{errors.city}</span>}

                <label>
                    Pokrajina/Region:
                    <input type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}/>
                </label>
                {errors.state && <span className="field-error">{errors.state}</span>}

                <label>
                    Poštanski broj:
                    <input type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}/>
                </label>
                {errors.zipCode && <span className="field-error">{errors.zipCode}</span>}

                <label>
                    Država:
                    <input type="text"
                    name="country"
                    value={address.country}
                    onChange={handleChange}/>
                </label>
                {errors.country && <span className="field-error">{errors.country}</span>}

                <button type="submit">{location.pathname === '/edit-address' ? 'Sačuvaj izmene' : "Sačuvaj adresu"}</button>

            </form>
        </div>
    )
}

export default AddressPage;
