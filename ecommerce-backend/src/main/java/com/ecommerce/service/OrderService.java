package com.ecommerce.service;

import java.util.List;

import com.ecommerce.dto.OrderItemDTO;
import com.ecommerce.model.entity.Order;

public interface OrderService {
	
	Order placeOrder(String userEmail, List<OrderItemDTO> items);
	List<Order> getUserOrders(String userEmail);
}
