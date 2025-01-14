import React, { useState } from "react";
import ApiService from "../../service/ApiService";

const AddAmenityForm = ({ roomId, onAmenityAdded }) => {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const amenity = { type, description };

    ApiService.addAmenityToRoom(roomId, amenity)
      .then((response) => {
        onAmenityAdded(response.data); // Notify parent about the new amenity
        setType("");
        setDescription("");
        setError("");
      })
      .catch((error) => {
        console.error("Error adding amenity:", error);
        setError("Failed to add amenity. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Amenity</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Type</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Amenity</button>
    </form>
  );
};

export default AddAmenityForm;
