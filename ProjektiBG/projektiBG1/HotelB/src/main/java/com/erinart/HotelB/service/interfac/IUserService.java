package com.erinart.HotelB.service.interfac;

import com.erinart.HotelB.entity.User;

public interface IUserService {

    Response register (User user);
    Response login (LoginRequest loginRequest);
    Response getAllUsers();
    Response getUserBookingHistory(String userId);
    Response deleteUser (String userId);
    Response getUserById (String userId);
    Response getMyInfo (String email);

}
