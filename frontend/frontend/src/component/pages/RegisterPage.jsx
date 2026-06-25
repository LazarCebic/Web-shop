import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/register.css'


const RegisterPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phoneNumber: '',
        password: ''
    });

    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9+\s-]{6,20}$/;

        if (!formData.email.trim()) {
            newErrors.email = "Email je obavezan";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Unesite ispravan format email adrese";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Ime je obavezno";
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Broj telefona je obavezan";
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Unesite ispravan broj telefona";
        }

        if (!formData.password) {
            newErrors.password = "Lozinka je obavezna";
        } else if (formData.password.length < 6) {
            newErrors.password = "Lozinka mora imati najmanje 6 karaktera";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            const response = await ApiService.registerUser(formData);
            if (response.status === 200) {
                setMessage("Uspešno ste se registrovali");
                setTimeout(() => {
                    navigate("/login")
                }, 4000)
            }
        } catch (error) {
            setMessage(error.response?.data.message || error.message || "Greška pri registraciji");
        }
    }

    return (
        <div className="register-page">
            <h2>Registracija</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange} />
                {errors.email && <span className="field-error">{errors.email}</span>}

                <label>Ime: </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange} />
                {errors.name && <span className="field-error">{errors.name}</span>}


                <label>Broj telefona: </label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange} />
                {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}

                <label>Lozinka: </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange} />
                {errors.password && <span className="field-error">{errors.password}</span>}

                    <button type="submit">Registruj se</button>
                    <p className="register-link">
                        Već imate nalog? <a href="/login">Prijavite se</a>
                    </p>
            </form>
        </div>
    )
}

export default RegisterPage;
