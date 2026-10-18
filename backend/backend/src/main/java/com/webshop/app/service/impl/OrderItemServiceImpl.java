package com.webshop.app.service.impl;

import com.webshop.app.dto.OrderDto;
import com.webshop.app.dto.OrderItemDto;
import com.webshop.app.dto.OrderItemRequest;
import com.webshop.app.dto.OrderRequest;
import com.webshop.app.dto.Response;
import com.webshop.app.entity.Order;
import com.webshop.app.entity.OrderItem;
import com.webshop.app.entity.Product;
import com.webshop.app.entity.User;
import com.webshop.app.enums.OrderStatus;
import com.webshop.app.exception.InsufficientStockException;
import com.webshop.app.exception.NotFoundException;
import com.webshop.app.mapper.EntityDtoMapper;
import com.webshop.app.repository.OrderItemRepo;
import com.webshop.app.repository.OrderRepo;
import com.webshop.app.repository.ProductRepo;
import com.webshop.app.service.interf.OrderItemService;
import com.webshop.app.service.interf.UserService;
import com.webshop.app.specification.OrderItemSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemServiceImpl implements OrderItemService {


    private final OrderRepo orderRepo;
    private final OrderItemRepo orderItemRepo;
    private final ProductRepo productRepo;
    private final UserService userService;
    private final EntityDtoMapper entityDtoMapper;


    @Override
    @Transactional
    public Response placeOrder(OrderRequest orderRequest) {

        User user = userService.getLoginUser();

        // prvo provericamo da za SVE stavke ima dovoljno na stanju, pre nego sto bilo sta sacuvamo
        // (ako bismo proveravali i odmah smanjivali stavku po stavku, neuspeh na trecoj stavci bi ostavio
        // prve dve vec smanjene - zato se provera radi unapred za citavu porudzbinu)
        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Product product = productRepo.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new NotFoundException("Product Not Found"));

            int available = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            if (itemRequest.getQuantity() > available) {
                throw new InsufficientStockException(
                        "Nedovoljno proizvoda '" + product.getName() + "' na stanju. Dostupno: " + available
                                + ", traženo: " + itemRequest.getQuantity());
            }
        }

        //map order request items to order entities
        List<OrderItem> orderItems = orderRequest.getItems().stream().map(orderItemRequest -> {
            Product product = productRepo.findById(orderItemRequest.getProductId())
                    .orElseThrow(()-> new NotFoundException("Product Not Found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(orderItemRequest.getQuantity());
            orderItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(orderItemRequest.getQuantity())));

            // smanjujemo stanje na zalihama odmah po kreiranju porudzbine
            product.setStockQuantity(product.getStockQuantity() - orderItemRequest.getQuantity());
            productRepo.save(product);

            return orderItem;

        }).collect(Collectors.toList());

        //calculate the total price
        // ukupna cena se uvek racuna na serveru iz stavki - cena sa klijenta (korpa u browseru) moze biti zastarela
        BigDecimal totalPrice = orderItems.stream().map(OrderItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);

        //create order entity
        Order order = new Order();
        order.setOrderItemList(orderItems);
        order.setTotalPrice(totalPrice);
        order.setStatus(OrderStatus.PENDING);
        order.setUser(user);

        //set the order reference in each orderitem
        orderItems.forEach(orderItem -> orderItem.setOrder(order));

        orderRepo.save(order);

        return Response.builder()
                .status(200)
                .message("Order was successfully placed")
                .order(entityDtoMapper.mapOrderToDto(order))
                .build();

    }

    @Override
    @Transactional
    public Response updateOrderItemStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
        OrderStatus previousStatus = order.getStatus();

        // ako se porudzbina otkazuje, vracamo kolicinu svih stavki na stanje
        if (newStatus == OrderStatus.CANCELLED && previousStatus != OrderStatus.CANCELLED) {
            restoreStock(order);
        }

        order.setStatus(newStatus);
        orderRepo.save(order);
        return Response.builder()
                .status(200)
                .message("Order status updated successfully")
                .build();
    }

    @Override
    @Transactional
    public Response cancelOwnPendingOrder(Long orderId) {
        User user = userService.getLoginUser();
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new NotFoundException("Order not found");
        }

        if (order.getStatus() == OrderStatus.PENDING) {
            restoreStock(order);
            order.setStatus(OrderStatus.CANCELLED);
            orderRepo.save(order);
        }

        return Response.builder()
                .status(200)
                .message("Order cancelled")
                .build();
    }

    private void restoreStock(Order order) {
        if (order.getOrderItemList() == null) return;
        for (OrderItem item : order.getOrderItemList()) {
            if (item.getProduct() != null) {
                int currentStock = item.getProduct().getStockQuantity() != null ? item.getProduct().getStockQuantity() : 0;
                item.getProduct().setStockQuantity(currentStock + item.getQuantity());
                productRepo.save(item.getProduct());
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate, Long itemId, Pageable pageable) {
        Specification<OrderItem> spec = Specification.where(OrderItemSpecification.hasStatus(status))
                .and(OrderItemSpecification.createdBetween(startDate, endDate))
                .and(OrderItemSpecification.hasItemId(itemId));

        Page<OrderItem> orderItemPage = orderItemRepo.findAll(spec, pageable);

        List<OrderItemDto> orderItemDtos = orderItemPage.getContent().stream()
                .map(entityDtoMapper::mapOrderItemToDtoPlusProductAndUser)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .orderItemList(orderItemDtos)
                .totalPage(orderItemPage.getTotalPages())
                .totalElement(orderItemPage.getTotalElements())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Response getAllOrders() {
        List<Order> orders = orderRepo.findAll();
        List<OrderDto> orderDtos = orders.stream()
                .map(entityDtoMapper::mapOrderToDto)
                .collect(Collectors.toList());
        return Response.builder()
                .status(200)
                .orderList(orderDtos)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Response getOrderById(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        return Response.builder()
                .status(200)
                .order(entityDtoMapper.mapOrderToDto(order))
                .build();
    }

}
