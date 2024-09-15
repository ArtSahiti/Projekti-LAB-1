package com.erinart.HotelB.service.interfac;

import com.erinart.HotelB.dto.Response;
import com.erinart.HotelB.entity.Booking;

public interface IBookingService {
    Response saveBooking(Long roomId, Long userId, Booking bookingRequest);

    Response findBookingByConfirmationCode(String confirmationCode);

    Response getAllBookings();

    Response cancelBooking(Long bookingId);

}
