package com.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.model.entity.Product;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
	
	@Autowired
	ProductService pService;
	
	@Autowired
	ProductRepository pRepo;
	
	@PostMapping
	public Product addProduct(@RequestBody Product product) {
		return pService.saveProduct(product);
	}
	
	@GetMapping
	public List<Product> getAllProducts(){
		return pService.getAllProducts();
	}
	
	@GetMapping("/{id}")
	public Product getProductById(@PathVariable Long id) {
		return pRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
	}
	
	@PutMapping("/{id}")
	public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
	    Product product = pRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("Product not found"));

	    product.setName(productDetails.getName());
	    product.setDescription(productDetails.getDescription());
	    product.setPrice(productDetails.getPrice());
	    product.setStock(productDetails.getStock());
	    product.setImageUrl(productDetails.getImageUrl());
	    product.setCategory(productDetails.getCategory());

	    return pRepo.save(product);
	}
	
	@DeleteMapping("/{id}")
	public String deleteProduct(@PathVariable Long id) {
	    pRepo.deleteById(id);
	    return "Product deleted successfully";
	}
	
}
