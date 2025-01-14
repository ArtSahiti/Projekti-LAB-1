import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import RoomReviews from '../common/RoomReviews';
import AddReviews from '../common/AddReviews'; 

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
  


  

  const handleConfirmBooking = () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please select check-in and check-out dates.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const totalDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalGuests = numAdults + numChildren;
    const totalPrice = roomDetails.roomPrice * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
  };

  const acceptBooking = async () => {
    try {
      const formattedCheckInDate = checkInDate.toISOString().split('T')[0];
      const formattedCheckOutDate = checkOutDate.toISOString().split('T')[0];

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren
      };

      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/rooms'); 
        }, 10000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  if (isLoading) {
    return <p className='room-detail-loading'>Loading room details...</p>;
  }

  if (error) {
    return <p className='room-detail-loading'>{error}</p>;
  }

  if (!roomDetails) {
    return <p className='room-detail-loading'>Room not found.</p>;
  }

  const { roomType, roomPrice, roomPhotoUrl, description, bookings } = roomDetails;

  return (
    <div className="room-details-booking">
      {showMessage && (
        <p className="booking-success-message">
          Booking successful! Confirmation code: {confirmationCode}. An SMS and email have been sent.
        </p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h2>Room Details</h2>
      <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
      <div className="room-details-info">
        <h3>{roomType}</h3>
        <p>Price: ${roomPrice} / night</p>
        <p>{description}</p>

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
        
        
      </div>
      <button className="book-now-button" onClick={() => setShowDatePicker(true)}>Book Now</button>
      <div className="booking-info">
  
        
        {showDatePicker && (
          <div className="date-picker-container">
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              placeholderText="Check-in Date"
              dateFormat="dd/MM/yyyy"
            />
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate}
              placeholderText="Check-out Date"
              dateFormat="dd/MM/yyyy"
            />
            <div className='guest-container'>
              <div>
                <label>Adults:</label>
                <input
                  type="number"
                  min="1"
                  value={numAdults}
                  onChange={(e) => setNumAdults(parseInt(e.target.value))}
                />
              </div>
              <div>
                <label>Children:</label>
                <input
                  type="number"
                  min="0"
                  value={numChildren}
                  onChange={(e) => setNumChildren(parseInt(e.target.value))}
                />
              </div>
              <button className="confirm-booking" onClick={handleConfirmBooking}>Confirm Booking</button>
            </div>
          </div>
        )}
        {totalPrice > 0 && (
          <div className="total-price">
            <p>Total Price: ${totalPrice}</p>
            <p>Total Guests: {totalGuests}</p>
            <button onClick={acceptBooking} className="accept-booking">Accept Booking</button>
          </div>
           
        )}

     
      {bookings && bookings.length > 0 && (
        <div>
          <h3>Existing Booking Details</h3>
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <li key={booking.id} className="booking-item">
                <span>Booking {index + 1} - Check-in: {booking.checkInDate} - Check-out: {booking.checkOutDate}</span>
              </li>
            ))}
          </ul>
          
        </div>
      )}


     

      <br />
           <RoomReviews roomId={roomId} />
           <br />
           <AddReviews roomId={roomId} />
           <br />
           <br />
      </div>
    </div>
  );
};



export default RoomDetailsPage;
