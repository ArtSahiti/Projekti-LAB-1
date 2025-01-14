import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService"; // Adjust the path to ApiService

function AddReview({ roomId }) {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  // To display error message to user
  const [userId, setUserId] = useState(null);  // State for storing user ID

  useEffect(() => {
    // Fetch user profile data to get user ID when the component mounts
    const fetchUserProfile = async () => {
      try {
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);  // Assuming userProfile has user id
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrorMessage("Unable to fetch user details. Please log in.");
      }
    };

    fetchUserProfile();
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment || !userId || !roomId) {
      setErrorMessage("Please fill in all fields correctly.");
      return;
    }

    const review = {
      userId,
      roomId,
      rating,
      comment,
    };

    // Get JWT token from local storage or wherever you store it
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("You must be logged in to submit a review.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
      },
    };

    try {
      await ApiService.addReview(review, config);  // Pass config to ApiService
      alert("Review submitted!");
      setComment("");
      setRating(1);
      setErrorMessage("");  // Clear any previous error messages
    } catch (error) {
      console.error("Review submission failed", error);
      setErrorMessage("There was an error submitting your review. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
  <label className="form-label">Rating:</label>
  <input
    type="number"
    value={rating}
    onChange={(e) => setRating(parseInt(e.target.value))}
    min="1"
    max="5"
    className="form-input"
  />
  <label className="form-label">Comment:</label>
  <textarea
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    className="form-textarea"
  />
  <button type="submit" className="form-button">
    Submit Review
  </button>
</form>
  );
}

export default AddReview;
