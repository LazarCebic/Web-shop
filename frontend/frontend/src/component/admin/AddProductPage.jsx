import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/addProduct.css'
import ApiService from "../../service/ApiService";

const AddProductPage = () => {

    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [size, setSize] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        ApiService.getAllCategory().then((res) => setCategories(res.categoryList));
    }, [])

    const handleImage = (e) => {
        setImage(e.target.files[0])
    }

    const validate = () => {
        const newErrors = {};
        if (!image) newErrors.image = "Slika proizvoda je obavezna";
        if (!categoryId) newErrors.categoryId = "Morate izabrati kategoriju";
        if (!name.trim()) newErrors.name = "Naziv proizvoda je obavezan";
        if (!description.trim()) newErrors.description = "Opis je obavezan";
        if (price === '' || isNaN(price) || Number(price) <= 0) newErrors.price = "Cena mora biti pozitivan broj";
        if (stockQuantity === '' || isNaN(stockQuantity) || Number(stockQuantity) < 0) {
            newErrors.stockQuantity = "Količina na stanju mora biti broj veći ili jednak nuli";
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
            const formData = new FormData();
            formData.append('image', image);
            formData.append('categoryId', categoryId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('stockQuantity', stockQuantity);
            if (size.trim()) formData.append('size', size.trim());

            const response = await ApiService.addProduct(formData);
            if (response.status === 200) {
                setMessage(response.message)
                setTimeout(() => {
                    setMessage('')
                    navigate('/admin/products')
                }, 3000);
            }

        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Greška pri dodavanju proizvoda')
        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit} className="product-form">
                <h2>Dodaj proizvod</h2>
                {message && <div className="message">{message}</div>}
                <input type="file" onChange={handleImage} />
                {errors.image && <span className="field-error">{errors.image}</span>}

                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} >
                    <option value="">Izaberi kategoriju</option>
                    {categories.map((cat)=>(
                        <option value={cat.id} key={cat.id}>{cat.name}</option>
                    ))}
                </select>
                {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}

                <input type="text"
                placeholder="Naziv proizvoda"
                value={name}
                onChange={(e)=> setName(e.target.value)} />
                {errors.name && <span className="field-error">{errors.name}</span>}

                <textarea
                placeholder="Opis proizvoda"
                value={description}
                onChange={(e)=> setDescription(e.target.value)}/>
                {errors.description && <span className="field-error">{errors.description}</span>}

                <input type="number"
                placeholder="Cena (RSD)"
                value={price}
                min="0"
                step="0.01"
                onChange={(e)=> setPrice(e.target.value)} />
                {errors.price && <span className="field-error">{errors.price}</span>}

                <input type="number"
                placeholder="Količina na stanju"
                value={stockQuantity}
                min="0"
                step="1"
                onChange={(e)=> setStockQuantity(e.target.value)} />
                {errors.stockQuantity && <span className="field-error">{errors.stockQuantity}</span>}

                <input type="text"
                placeholder="Veličina (npr. M, 42, 32) — samo za odeću/obuću"
                value={size}
                onChange={(e)=> setSize(e.target.value)} />

                <button type="submit">Dodaj proizvod</button>
            </form>
        </div>
    )

}
export default AddProductPage;
