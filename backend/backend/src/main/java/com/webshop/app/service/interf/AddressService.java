package com.webshop.app.service.interf;

import com.webshop.app.dto.AddressDto;
import com.webshop.app.dto.Response;

public interface AddressService {
    Response saveAndUpdateAddress(AddressDto addressDto);
}
