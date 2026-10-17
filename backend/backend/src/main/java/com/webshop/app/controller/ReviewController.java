package com.webshop.app.controller;

import com.webshop.app.dto.Response;
import com.webshop.app.service.interf.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> createReview(
            @RequestParam Long productId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String content
    ) {
        return ResponseEntity.ok(reviewService.createReview(productId, rating, content));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Response> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @DeleteMapping("/delete/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Response> deleteReview(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.deleteReview(reviewId));
    }
}
