package com.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.model.entity.Category;
import com.ecommerce.repository.CategoryRepository;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {
	
	@Autowired
	private CategoryRepository cRepo;
	
	
	@PostMapping
	public Category createCategory(@RequestBody Category category) {
		return cRepo.save(category);
	}
	
	@GetMapping
	public List<Category> getAllCategories(){
		return cRepo.findAll();
	}
	
}
