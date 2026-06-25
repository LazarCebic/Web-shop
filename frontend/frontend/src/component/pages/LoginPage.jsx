import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/register.css'


const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
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
        if (!formData.email.trim()) newErrors.email = "Email je obavezan";
        if (!formData.password) newErrors.password = "Lozinka je obavezna";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            const response = await ApiService.loginUser(formData);
            if (response.status === 200) {
                setMessage("Uspešno ste se prijavili");
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                setTimeout(() => {
                    navigate("/profile")
                }, 4000)
            }
        } catch (error) {
            setMessage(error.response?.data.message || error.message || "Greška pri prijavi");
        }
    }

    return (
        <div className="register-page">
            <h2>Prijava</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email: </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange} />
                {errors.email && <span className="field-error">{errors.email}</span>}

                <label>Lozinka: </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange} />
                {errors.password && <span className="field-error">{errors.password}</span>}

                    <button type="submit">Prijavi se</button>

                    <p className="register-link">
                        Nemate nalog? <a href="/register">Registrujte se</a>
                    </p>
            </form>
        </div>
    )
}

export default LoginPage;
