package com.ecommerce.service;

import com.ecommerce.model.entity.User;

public interface UserService {
	
	User registerUser(User user);
	
	User findByEmail(String email);
}
