package com.erinart.HotelB.repo;

import com.erinart.HotelB.dto.ReviewDTO;
import com.erinart.HotelB.dto.ReviewSummaryDTO;
import com.erinart.HotelB.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT new com.erinart.HotelB.dto.ReviewSummaryDTO(r.rating, r.comment) FROM Review r WHERE r.room.id = :roomId")
    List<ReviewSummaryDTO> findReviewSummariesByRoomId(@Param("roomId") Long roomId);
}



