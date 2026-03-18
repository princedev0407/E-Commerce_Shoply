package com.ecommerce.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.model.entity.Product;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService{
	
	@Autowired
	ProductRepository pRepo;

	@Override
	public Product saveProduct(Product product) {
		// TODO Auto-generated method stub
		return pRepo.save(product);
	}

	@Override
	public List<Product> getAllProducts() {
		// TODO Auto-generated method stub
		return pRepo.findAll();
	}
	
	
	
}
