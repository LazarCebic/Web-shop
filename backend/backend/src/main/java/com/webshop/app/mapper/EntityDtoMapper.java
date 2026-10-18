package com.webshop.app.mapper;

import com.webshop.app.dto.*;
import com.webshop.app.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {


    //user entity to user DTO

    public UserDto mapUserToDtoBasic(User user){
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole().name());
        userDto.setName(user.getName());
        return userDto;

    }

    //Address to DTO Basic
    public AddressDto mapAddressToDtoBasic(Address address){
        AddressDto addressDto = new AddressDto();
        addressDto.setId(address.getId());
        addressDto.setCity(address.getCity());
        addressDto.setStreet(address.getStreet());
        addressDto.setState(address.getState());
        addressDto.setCountry(address.getCountry());
        addressDto.setZipCode(address.getZipCode());
        return addressDto;
    }

    //Category to DTO basic
    public CategoryDto mapCategoryToDtoBasic(Category category){
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        return categoryDto;
    }


    //OrderItem to DTO Basics
    public OrderItemDto mapOrderItemToDtoBasic(OrderItem orderItem){
        OrderItemDto orderItemDto = new OrderItemDto();
        orderItemDto.setId(orderItem.getId());
        orderItemDto.setQuantity(orderItem.getQuantity());
        orderItemDto.setPrice(orderItem.getPrice());
        orderItemDto.setCreatedAt(orderItem.getCreatedAt());
        if (orderItem.getOrder() != null) {
            orderItemDto.setOrderId(orderItem.getOrder().getId());
            if (orderItem.getOrder().getStatus() != null) {
                orderItemDto.setStatus(orderItem.getOrder().getStatus().name());
            }
        }
        return orderItemDto;
    }

    //Product to DTO Basic
    public ProductDto mapProductToDtoBasic(Product product){
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        productDto.setStockQuantity(product.getStockQuantity());
        productDto.setImageUrl(product.getImageUrl());
        productDto.setSize(product.getSize());
        if (product.getCategory() != null) {
            productDto.setCategory(mapCategoryToDtoBasic(product.getCategory()));
        }
        return productDto;
    }

    //Review to DTO Basic
    public ReviewDto mapReviewToDto(Review review){
        ReviewDto reviewDto = new ReviewDto();
        reviewDto.setId(review.getId());
        reviewDto.setRating(review.getRating());
        reviewDto.setContent(review.getContent());
        reviewDto.setCreatedAt(review.getCreatedAt());
        if (review.getUser() != null) {
            reviewDto.setUserId(review.getUser().getId());
            reviewDto.setUserName(review.getUser().getName());
        }
        if (review.getProduct() != null) {
            reviewDto.setProductId(review.getProduct().getId());
        }
        return reviewDto;
    }

    public UserDto mapUserToDtoPlusAddress(User user){

        System.out.println("mapUserToDtoPlusAddress is called");
        UserDto userDto = mapUserToDtoBasic(user);
        if (user.getAddress() != null){

            AddressDto addressDto = mapAddressToDtoBasic(user.getAddress());
            userDto.setAddress(addressDto);

        }
        return userDto;
    }


    //orderItem to DTO plus product
    public OrderItemDto mapOrderItemToDtoPlusProduct(OrderItem orderItem){
        OrderItemDto orderItemDto = mapOrderItemToDtoBasic(orderItem);

        if (orderItem.getProduct() != null) {
            ProductDto productDto = mapProductToDtoBasic(orderItem.getProduct());
            orderItemDto.setProduct(productDto);
        }
        return orderItemDto;
    }


    //OrderItem to DTO plus product and user (user comes from parent order)
    public OrderItemDto mapOrderItemToDtoPlusProductAndUser(OrderItem orderItem){
        OrderItemDto orderItemDto = mapOrderItemToDtoPlusProduct(orderItem);

        if (orderItem.getOrder() != null && orderItem.getOrder().getUser() != null){
            UserDto userDto = mapUserToDtoPlusAddress(orderItem.getOrder().getUser());
            orderItemDto.setUser(userDto);
        }
        return orderItemDto;
    }


    //USer to DTO with Address and Order Items History
    public UserDto mapUserToDtoPlusAddressAndOrderHistory(User user) {
        UserDto userDto = mapUserToDtoPlusAddress(user);

        if (user.getOrderList() != null && !user.getOrderList().isEmpty()) {
            List<OrderItemDto> allItems = user.getOrderList().stream()
                    .filter(o -> o.getOrderItemList() != null)
                    .flatMap(o -> o.getOrderItemList().stream())
                    .map(this::mapOrderItemToDtoPlusProduct)
                    .collect(Collectors.toList());
            userDto.setOrderItemList(allItems);
        }
        return userDto;
    }






    //Order to DTO, sa svim stavkama (proizvod + korisnik za svaku stavku)
    public OrderDto mapOrderToDto(Order order){
        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setTotalPrice(order.getTotalPrice());
        orderDto.setCreatedAt(order.getCreatedAt());
        if (order.getStatus() != null) {
            orderDto.setStatus(order.getStatus().name());
        }
        if (order.getUser() != null) {
            orderDto.setUser(mapUserToDtoPlusAddress(order.getUser()));
        }
        if (order.getOrderItemList() != null){
            orderDto.setOrderItemList(order.getOrderItemList()
                    .stream()
                    .map(this::mapOrderItemToDtoPlusProductAndUser)
                    .collect(Collectors.toList()));
        }
        return orderDto;
    }

    //Payment to DTO, sa ugnjezdenim detaljima porudzbine za admin prikaz
    public PaymentDto mapPaymentToDto(Payment payment){
        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setId(payment.getId());
        paymentDto.setAmount(payment.getAmount());
        paymentDto.setMethod(payment.getMethod());
        paymentDto.setStatus(payment.getStatus());
        paymentDto.setStripeSessionId(payment.getStripeSessionId());
        paymentDto.setStripePaymentIntentId(payment.getStripePaymentIntentId());
        paymentDto.setCustomerEmail(payment.getCustomerEmail());
        paymentDto.setCreatedAt(payment.getCreatedAt());
        if (payment.getOrder() != null){
            paymentDto.setOrder(mapOrderToDto(payment.getOrder()));
        }
        return paymentDto;
    }

}
