import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
        amenities: [], // Add amenities state
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newAmenity, setNewAmenity] = useState({
        type: '',
        description: ''
    });

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await ApiService.getRoomById(roomId);
                setRoomDetails({
                    roomPhotoUrl: response.room.roomPhotoUrl,
                    roomType: response.room.roomType,
                    roomPrice: response.room.roomPrice,
                    roomDescription: response.room.roomDescription,
                    amenities: response.room.amenities || [], // Set the fetched amenities
                });
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchRoomDetails();
    }, [roomId]);


  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const amenities = await ApiService.fetchAmenitiesForRoom(roomId);
        setRoomDetails((prevDetails) => ({
          ...prevDetails,
          amenities,
        }));
      } catch (error) {
        console.error('Error fetching amenities:', error);
      }
    };
  
    fetchAmenities();
  }, [roomId]);
  


    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    };

    const handleAmenityChange = (e) => {
        const { name, value } = e.target;
        setNewAmenity(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddAmenity = async () => {
        try {
            const response = await ApiService.addAmenityToRoom(roomId, newAmenity);
            if (response.statusCode === 200) {
                setRoomDetails(prevState => ({
                    ...prevState,
                    amenities: [...prevState.amenities, newAmenity], // Update the list of amenities
                }));
                setNewAmenity({ type: '', description: '' }); // Reset the form
                setSuccess('Amenity added successfully.');
                setTimeout(() => setSuccess(''), 5000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);

            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.updateRoom(roomId, formData);
            if (result.statusCode === 200) {
                setSuccess('Room updated successfully.');
                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Do you want to delete this room?')) {
            try {
                const result = await ApiService.deleteRoom(roomId);
                if (result.statusCode === 200) {
                    setSuccess('Room Deleted successfully.');
                    setTimeout(() => {
                        setSuccess('');
                        navigate('/admin/manage-rooms');
                    }, 3000);
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setTimeout(() => setError(''), 5000);
            }
        }
    };

    return (
        <div className="edit-room-container">
            <h2>Edit Room</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="edit-room-form">
                <div className="form-group">
                    {preview ? (
                        <img src={preview} alt="Room Preview" className="room-photo-preview" />
                    ) : (
                        roomDetails.roomPhotoUrl && (
                            <img src={roomDetails.roomPhotoUrl} alt="Room" className="room-photo" />
                        )
                    )}
                    <input
                        type="file"
                        name="roomPhoto"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="form-group">
                    <label>Room Type</label>
                    <input
                        type="text"
                        name="roomType"
                        value={roomDetails.roomType}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Room Price</label>
                    <input
                        type="text"
                        name="roomPrice"
                        value={roomDetails.roomPrice}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Room Description</label>
                    <textarea
                        name="roomDescription"
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Amenities Section */}
                <div className="form-group">
                <h3>Amenities</h3>
        {roomDetails.amenities && roomDetails.amenities.length > 0 ? (
  <ul>
    {roomDetails.amenities.map((amenity) => (
      <li key={amenity.amenityId}>
        <strong>{amenity.type}</strong>: {amenity.description}
      </li>
    ))}
  </ul>
) : (
  <p>No amenities added yet.</p>
)}
<br />

                    <label>Amenity Type</label>
                    <input
                        type="text"
                        name="type"
                        value={newAmenity.type}
                        onChange={handleAmenityChange}
                    />

                    <label>Amenity Description</label>
                    <input
                        type="text"
                        name="description"
                        value={newAmenity.description}
                        onChange={handleAmenityChange}
                    />

                    <button type="button" onClick={handleAddAmenity}>Add Amenity</button>
                </div>

                <button className="update-button" onClick={handleUpdate}>Update Room</button>
                <button className="delete-button" onClick={handleDelete}>Delete Room</button>
            </div>
        </div>
    );
};

export default EditRoomPage;
