package com.ecommerce.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.dto.OrderItemDTO;
import com.ecommerce.model.entity.Order;
import com.ecommerce.model.entity.OrderItem;
import com.ecommerce.model.entity.Product;
import com.ecommerce.model.entity.User;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService{
	
	@Autowired
	private OrderRepository oRepo;
	@Autowired
	private OrderItemRepository oiRepo;
	@Autowired
	private ProductRepository pRepo;
	@Autowired
	private UserRepository uRepo;
	
	
	@Override
	@Transactional
	public Order placeOrder(String userEmail, List<OrderItemDTO> items) {
		
		//  going the find the user 
		User user = uRepo.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User Not Found"));
		
		
		//going to create the order
		Order order = new Order();
		order.setUser(user);
		order.setOrderDate(LocalDateTime.now());
		order.setStatus("Confirmed");
		
		
		// Save order first to generate ID
		order = oRepo.save(order);
		
		double totalAmount = 0;
		
		
		// Process the items
		
		for(OrderItemDTO itemDto : items) {
			Product product = pRepo.findById(itemDto.getProductId()).orElseThrow(() -> new RuntimeException("Product Not Found"));
			
			OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice()); // Use DB price, not Frontend price!

            oiRepo.save(orderItem);

            totalAmount += product.getPrice() * itemDto.getQuantity();
		}
		
		order.setTotalAmount(totalAmount);
		return oRepo.save(order);
		
	}

	@Override
	public List<Order> getUserOrders(String userEmail) {
		User user = uRepo.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
	    
	    return oRepo.findByUser(user);
	}
	
}
