package com.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.model.entity.Order;
import com.ecommerce.model.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long>{
	
	List<Order> findByUserId(Long userId);
	List<Order> findByUser(User user);
}
