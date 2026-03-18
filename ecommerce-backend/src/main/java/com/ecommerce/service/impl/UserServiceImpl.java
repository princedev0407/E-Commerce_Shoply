package com.ecommerce.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.exception.UserNotFoundException;
import com.ecommerce.model.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.UserService;


@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserRepository uRepo;
	
	@Autowired
	private BCryptPasswordEncoder encoder;
	

	@Override
	public User registerUser(User user) {
		
		user.setPassword(encoder.encode(user.getPassword()));
		return uRepo.save(user);
	}

	@Override
	public User findByEmail(String email) {
		return uRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
	}
	
}
