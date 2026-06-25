import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import '../../style/addCategory.css'

const EditCategory = () => {
    const { categoryId } = useParams();
    const [name, setName] = useState('')
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        fetchCategory(categoryId);
    }, [categoryId]) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchCategory = async () => {
        try {
            const response = await ApiService.getCategoryById(categoryId);
            setName(response.category.name);

        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Greška pri učitavanju kategorije")
            setTimeout(() => {
                setMessage('');
            }, 3000)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Naziv kategorije je obavezan");
            return;
        }
        setError('');

        try {
            const response = await ApiService.updateCategory(categoryId, { name });
            if (response.status === 200) {
                setMessage(response.message);
                setTimeout(() => {
                    setMessage('');
                    navigate("/admin/categories")
                }, 3000)
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Greška pri čuvanju kategorije")
        }
    }

    return (
        <div className="add-category-page">
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit} className="category-form">
                <h2>Izmeni kategoriju</h2>
                <input type="text"
                    placeholder="Naziv kategorije"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                {error && <span className="field-error">{error}</span>}

                <button type="submit">Sačuvaj izmene</button>
            </form>
        </div>
    )

}

export default EditCategory;
