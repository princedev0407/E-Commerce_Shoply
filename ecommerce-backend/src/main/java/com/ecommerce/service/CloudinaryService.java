package com.ecommerce.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {
	
	@Autowired
	private Cloudinary cloudinary;
	
	public String uploadImage(MultipartFile file) {
		try {
			Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
			return uploadResult.get("url").toString();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			throw new RuntimeException("Image upload failed");
		}
	}
}
