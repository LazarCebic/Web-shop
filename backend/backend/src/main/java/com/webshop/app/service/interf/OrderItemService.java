package com.webshop.app.service.interf;

import com.webshop.app.dto.OrderRequest;
import com.webshop.app.dto.Response;
import com.webshop.app.enums.OrderStatus;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface OrderItemService {
    Response placeOrder(OrderRequest orderRequest);
    Response updateOrderItemStatus(Long orderItemId, String status);
    Response cancelOwnPendingOrder(Long orderId);
    Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate, Long itemId, Pageable pageable);
    Response getOrderById(Long orderId);
    Response getAllOrders();
}
