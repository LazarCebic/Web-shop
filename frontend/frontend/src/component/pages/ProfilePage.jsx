import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import '../../style/profile.css';
import Pagination from "../common/Pagination";

const ProfilePage = () => {

    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();


    useEffect(() => {

        fetchUserInfo();
    }, []);
    const fetchUserInfo = async () => {

        try {
            const response = await ApiService.getLoggedInUserInfo();
            setUserInfo(response.user);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch user info');
        }
    }

    if (!userInfo) {
        return <div>Loading...</div>
    }

    const handleAddressClick = () => {
        navigate(userInfo.address ? '/edit-address' : '/add-address');
    }

    const orderItemList = userInfo.orderItemList || [];

    const totalPages = Math.ceil(orderItemList.length / itemsPerPage);

    const paginatedOrders = orderItemList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );




    return (
        <div className="profile-page">
            <h2>Dobrodošli, {userInfo.name}</h2>

            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    <p><strong>Ime: </strong>{userInfo.name}</p>
                    <p><strong>Email: </strong>{userInfo.email}</p>
                    <p><strong>Telefon: </strong>{userInfo.phoneNumber}</p>

                    <div>
                        <h3>Adresa</h3>
                        {userInfo.address ? (
                            <div>
                                <p><strong>Ulica: </strong>{userInfo.address.street}</p>
                                <p><strong>Grad: </strong>{userInfo.address.city}</p>
                                <p><strong>Pokrajina: </strong>{userInfo.address.state}</p>
                                <p><strong>Poštanski broj: </strong>{userInfo.address.zipCode}</p>
                                <p><strong>Država: </strong>{userInfo.address.country}</p>
                            </div>
                        ) : (
                            <p>Nema dostupnih informacija o adresi</p>
                        )}
                        <button className="profile-button" onClick={handleAddressClick}>
                            {userInfo.address ? "Izmeni adresu" : "Dodaj adresu"}
                        </button>
                    </div>
                    <h3>Istorija porudžbina</h3>
                    <ul>
                        {paginatedOrders.map(order => (
                            <li key={order.id}>
                                <img src={order.product?.imageUrl} alt={order.product.name} />
                                <div>
                                    <p><strong>Naziv: </strong>{order.product.name}</p>
                                    <p><strong>Status: </strong>{order.status}</p>
                                    <p><strong>Količina: </strong>{order.quantity}</p>
                                    <p><strong>Cena: </strong>{order.price.toLocaleString('sr-RS')} RSD</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page)=> setCurrentPage(page)}/>
                </div>
            )}
        </div>
    )
}

export default ProfilePage;