package com.erinart.HotelB.dto;

public class ReviewDTO {

    private Long userId;
    private Long roomId;
    private int rating;
    private String comment;

    // Constructors



    public ReviewDTO(Long userId, Long roomId, int rating, String comment) {
        this.userId = userId;
        this.roomId = roomId;
        this.rating = rating;
        this.comment = comment;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }




}
