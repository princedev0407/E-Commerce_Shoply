package com.ecommerce.dto;

import lombok.Data;

@Data
public class OrderItemDTO {
	
	private Long productId;
    private int quantity;
}
