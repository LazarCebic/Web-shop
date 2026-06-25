package com.webshop.app.service.interf;

import com.webshop.app.dto.LoginRequest;
import com.webshop.app.dto.Response;
import com.webshop.app.dto.UserDto;
import com.webshop.app.entity.User;

public interface UserService {
    Response registerUser(UserDto registrationRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getLoginUser();
    Response getUserInfoAndOrderHistory();
}
