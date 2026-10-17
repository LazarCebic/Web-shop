package com.webshop.app.controller;


import com.webshop.app.dto.OrderRequest;
import com.webshop.app.dto.Response;
import com.webshop.app.enums.OrderStatus;
import com.webshop.app.service.interf.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> placeOrder(@RequestBody OrderRequest orderRequest){
        return ResponseEntity.ok(orderItemService.placeOrder(orderRequest));
    }

    @PutMapping("/cancel/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> cancelOrder(@PathVariable Long orderId){
        return ResponseEntity.ok(orderItemService.cancelOwnPendingOrder(orderId));
    }

    @PutMapping("/update-item-status/{orderItemId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateOrderItemStatus(@PathVariable Long orderItemId,  @RequestParam String status){
        return ResponseEntity.ok(orderItemService.updateOrderItemStatus(orderItemId, status));
    }


    @GetMapping("/filter")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> filterOrderItems(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime endDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long itemId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size

            ){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        OrderStatus orderStatus = status != null ? OrderStatus.valueOf(status.toUpperCase()) : null;

        return ResponseEntity.ok(orderItemService.filterOrderItems(orderStatus, startDate, endDate, itemId, pageable));

    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllOrders(){
        return ResponseEntity.ok(orderItemService.getAllOrders());
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> getOrderById(@PathVariable Long orderId){
        return ResponseEntity.ok(orderItemService.getOrderById(orderId));
    }

}
