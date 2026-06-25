import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";
import '../../style/addCategory.css'

const AddCategory = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Naziv kategorije je obavezan");
            return;
        }
        setError('');

        try {
            const response = await ApiService.createCategory({name});
            if (response.status === 200) {
                setMessage(response.message);
                setTimeout(()=>{
                    setMessage('');
                    navigate("/admin/categories")
                }, 3000)
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Greška pri dodavanju kategorije")
        }
    }

    return(
        <div className="add-category-page">
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit} className="category-form">
                <h2>Dodaj kategoriju</h2>
                <input type="text"
                placeholder="Naziv kategorije"
                value={name}
                onChange={(e)=> setName(e.target.value)} />
                {error && <span className="field-error">{error}</span>}

                <button type="submit">Dodaj</button>
            </form>
        </div>
    )
}

export default AddCategory;
