package com.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.model.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{

}
