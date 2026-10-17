package com.webshop.app.service.impl;

import com.webshop.app.dto.Response;
import com.webshop.app.dto.ReviewDto;
import com.webshop.app.entity.Product;
import com.webshop.app.entity.Review;
import com.webshop.app.entity.User;
import com.webshop.app.enums.UserRole;
import com.webshop.app.exception.InvalidCredentialsException;
import com.webshop.app.exception.NotFoundException;
import com.webshop.app.mapper.EntityDtoMapper;
import com.webshop.app.repository.ProductRepo;
import com.webshop.app.repository.ReviewRepo;
import com.webshop.app.service.interf.ReviewService;
import com.webshop.app.service.interf.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepo reviewRepo;
    private final ProductRepo productRepo;
    private final UserService userService;
    private final EntityDtoMapper entityDtoMapper;

    @Override
    public Response createReview(Long productId, Integer rating, String content) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new InvalidCredentialsException("Ocena mora biti izmedju 1 i 5");
        }

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Proizvod nije pronadjen"));
        User user = userService.getLoginUser();

        if (reviewRepo.existsByProductIdAndUserId(productId, user.getId())) {
            throw new InvalidCredentialsException("Vec ste ocenili ovaj proizvod");
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(rating);
        review.setContent(content);

        reviewRepo.save(review);

        return Response.builder()
                .status(200)
                .message("Recenzija je uspesno dodata")
                .review(entityDtoMapper.mapReviewToDto(review))
                .build();
    }

    @Override
    public Response getReviewsByProduct(Long productId) {
        List<Review> reviews = reviewRepo.findByProductIdOrderByCreatedAtDesc(productId);
        List<ReviewDto> reviewDtoList = reviews.stream()
                .map(entityDtoMapper::mapReviewToDto)
                .collect(Collectors.toList());

        Double average = reviewRepo.findAverageRatingByProductId(productId);

        return Response.builder()
                .status(200)
                .reviewList(reviewDtoList)
                .averageRating(average)
                .totalElement(reviews.size())
                .build();
    }

    @Override
    public Response deleteReview(Long reviewId) {
        Review review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Recenzija nije pronadjena"));

        User user = userService.getLoginUser();
        boolean isOwner = review.getUser() != null && review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new InvalidCredentialsException("Nemate dozvolu da obrisete ovu recenziju");
        }

        reviewRepo.delete(review);

        return Response.builder()
                .status(200)
                .message("Recenzija je obrisana")
                .build();
    }
}
