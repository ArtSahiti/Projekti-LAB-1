package com.erinart.HotelB.service.impl;

import com.erinart.HotelB.dto.ReviewDTO;
import com.erinart.HotelB.dto.ReviewSummaryDTO;
import com.erinart.HotelB.entity.Review;
import com.erinart.HotelB.entity.Room;
import com.erinart.HotelB.entity.User;
import com.erinart.HotelB.repo.ReviewRepository;
import com.erinart.HotelB.repo.RoomRepository;
import com.erinart.HotelB.repo.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Transactional
    public Review addReview(ReviewDTO reviewDTO) {
        User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Room room = roomRepository.findById(reviewDTO.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Review review = new Review(user, room, reviewDTO.getRating(), reviewDTO.getComment());


        return reviewRepository.save(review);
    }




    public List<ReviewSummaryDTO> getReviewSummariesByRoomId(Long roomId) {
        return reviewRepository.findReviewSummariesByRoomId(roomId);
    }

}