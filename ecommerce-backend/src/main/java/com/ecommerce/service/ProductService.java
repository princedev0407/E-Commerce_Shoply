package com.ecommerce.service;

import java.util.List;

import com.ecommerce.model.entity.Product;

public interface ProductService {
	
	Product saveProduct(Product product);
	
	List<Product> getAllProducts();
}
