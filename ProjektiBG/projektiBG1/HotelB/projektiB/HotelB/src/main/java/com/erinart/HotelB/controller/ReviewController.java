package com.erinart.HotelB.controller;

import com.erinart.HotelB.dto.ReviewDTO;
import com.erinart.HotelB.dto.ReviewSummaryDTO;
import com.erinart.HotelB.entity.Review;
import com.erinart.HotelB.service.impl.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('USER')") // JWT token should ensure this endpoint is accessed by logged-in users
    public ResponseEntity<String> addReview(@RequestBody ReviewDTO reviewDTO) {
        if (reviewDTO.getUserId() == null || reviewDTO.getRoomId()== null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID and Room ID must be provided");
        }
        reviewService.addReview(reviewDTO);
        return ResponseEntity.ok("Review submitted successfully");
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ReviewSummaryDTO>> getReviewsByRoomId(@PathVariable Long roomId) {
        List<ReviewSummaryDTO> reviews = reviewService.getReviewSummariesByRoomId(roomId);
        if (reviews.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reviews);
    }

}
