package com.ecommerce.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.model.entity.User;
import com.ecommerce.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private UserRepository uRepo;
	
	@GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Principal principal) {
        User user = uRepo.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        
        // Add the new fields
        profile.put("address", user.getAddress());
        profile.put("city", user.getCity());
        profile.put("zip", user.getZip());

        return ResponseEntity.ok(profile);
    }
	
	@PutMapping("/profile/address")
    public ResponseEntity<?> updateAddress(@RequestBody Map<String, String> addressData, Principal principal) {
        User user = uRepo.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update the user's fields
        user.setAddress(addressData.get("address"));
        user.setCity(addressData.get("city"));
        user.setZip(addressData.get("zip"));
        
        // Save back to database
        uRepo.save(user);

        return ResponseEntity.ok("Address saved successfully");
    }
	
	@PutMapping("/profile/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> passwords, Principal principal) {
        String currentPassword = passwords.get("currentPassword");
        String newPassword = passwords.get("newPassword");

        // 1. Find the logged-in user
        User user = uRepo.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check if the current password they typed matches the one in the database
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return new ResponseEntity<>("Incorrect current password.", HttpStatus.BAD_REQUEST);
        }

        // 3. Encode the new password and save it
        user.setPassword(passwordEncoder.encode(newPassword));
        uRepo.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }
}
