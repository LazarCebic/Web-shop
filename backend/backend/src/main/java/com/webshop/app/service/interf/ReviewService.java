package com.webshop.app.service.interf;

import com.webshop.app.dto.Response;

public interface ReviewService {
    Response createReview(Long productId, Integer rating, String content);
    Response getReviewsByProduct(Long productId);
    Response deleteReview(Long reviewId);
}
