package com.ecommerce.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dto.OrderItemDTO;
import com.ecommerce.model.entity.Order;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
	
	
	@Autowired
	private OrderService oService;
	
	@Autowired
	private OrderRepository oRepo;
	
	@PostMapping("/checkout")
	public ResponseEntity<?> checkout(@RequestBody List<OrderItemDTO> items, Principal principal){
		if(items == null || items.isEmpty()) {
            return new ResponseEntity<>("Cart is empty", HttpStatus.BAD_REQUEST);
        }
		
		
		Order newOrder = oService.placeOrder(principal.getName(), items);
		return new ResponseEntity<>(newOrder, HttpStatus.OK);
	}
	
	@GetMapping("/my-orders")
	public List<Order> getMyOrders(Principal principal) {
	    return oService.getUserOrders(principal.getName());
	}
	
	@GetMapping("/admin/all-orders")
	public List<Order> getAllOrders() {
	    return oRepo.findAll(); // Fetches every order in the DB
	}
	
	@PutMapping("/{id}/status")
	public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
		String newStatus = payload.get("status");
		
		Order order = oRepo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
		order.setStatus(newStatus);
		oRepo.save(order);
		
		return ResponseEntity.ok(order);
	}
}
