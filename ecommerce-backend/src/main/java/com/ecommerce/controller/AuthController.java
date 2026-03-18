package com.ecommerce.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.config.JwtUtil;
import com.ecommerce.dto.UserDTO;
import com.ecommerce.model.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
	
	@Autowired
	private UserService uService;
	
	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private JwtUtil jUtil;
	
	@Autowired
	private UserRepository uRepo;
	
	
	private Map<String, String> otpStorage = new HashMap<>();
	
	 @PostMapping("/register")
	 public ResponseEntity<?> register(@RequestBody User user) {
			try {
				user.setRole("USER");
				
				// 1. Prevent Hibernate from crashing on null values
				if (user.getAddress() == null) user.setAddress("");
				if (user.getCity() == null) user.setCity("");
				if (user.getZip() == null) user.setZip("");

				// 2. to save the user to the database
				User savedUser = uService.registerUser(user);

				// 3. Map to DTO for a clean response
				UserDTO dto = new UserDTO();
				dto.setId(savedUser.getId());
				dto.setName(savedUser.getName());
				dto.setEmail(savedUser.getEmail());
				dto.setRole(savedUser.getRole());

				// 4. Success! Return the DTO
				return ResponseEntity.ok(dto);
				
			} catch (Exception e) {
				// If the email already exists or the database rejects it, catch it here.
				// This sends a clean 400 error to React instead of a 500 server crash.
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body("Registration failed. This email might already be in use.");
			}
		}

	    @PostMapping("/login")
	    public ResponseEntity<?> login(@RequestBody User user) {

	    	try {
	            User dbUser = uService.findByEmail(user.getEmail());

	            // if they type an email that doesn't exist?
	            if (dbUser == null) {
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
	            }

	            // 2. Check the password
	            if (!encoder.matches(user.getPassword(), dbUser.getPassword())) {
	                // Return a proper 401 error instead of throwing a RuntimeException!
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
	            }

	            // 3. If everything is correct, generate token and return success!
	            String token = jUtil.generateToken(dbUser.getEmail(), dbUser.getRole());
	            
	            Map<String, String> response = new HashMap<>();
	            response.put("token", token);
	            response.put("role", dbUser.getRole()); 
	            
	            return ResponseEntity.ok(response);

	        } catch (Exception e) {
	            // Catch any other weird database errors and still return a safe message
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
	        }
	        
	    }
	    
	    
	    @PostMapping("/forgot-password/generate-otp")
	    public ResponseEntity<?> generateOtp(@RequestBody Map<String, String> request) {
	        String email = request.get("email");

	        // Check if the dummy user actually exists
	        User user = uRepo.findByEmail(email).orElse(null);
	        if (user == null) {
	            return new ResponseEntity<>("User not found with this email.", HttpStatus.NOT_FOUND);
	        }

	        // Generate a random 4-digit OTP
	        String otp = String.format("%04d", new Random().nextInt(10000));
	        
	        // Save it in our map
	        otpStorage.put(email, otp);

	        // 🚀 THE MAGIC TRICK: Print it to your Spring Boot console so you can see it!
	        System.out.println("\n========================================");
	        System.out.println("🚨 PASSWORD RESET OTP FOR " + email + " IS: " + otp);
	        System.out.println("========================================\n");

	        return ResponseEntity.ok("OTP generated successfully.");
	    }
	    
	    
	    @PostMapping("/forgot-password/reset")
	    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
	        String email = request.get("email");
	        String otp = request.get("otp");
	        String newPassword = request.get("newPassword");

	        // 1. Verify the OTP matches what we saved
	        String savedOtp = otpStorage.get(email);
	        if (savedOtp == null || !savedOtp.equals(otp)) {
	            return new ResponseEntity<>("Invalid or expired OTP.", HttpStatus.BAD_REQUEST);
	        }

	        // 2. Find the user
	        User user = uRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
	        
            // 🚀 THE FIX: If the user doesn't have an address yet, set them to empty strings so Hibernate doesn't panic!
            if (user.getAddress() == null) user.setAddress("");
            if (user.getCity() == null) user.setCity("");
            if (user.getZip() == null) user.setZip("");

            // 3. Encode and save
	        user.setPassword(encoder.encode(newPassword)); 
	        uRepo.save(user);

	        // 4. Delete the OTP so it can't be used again
	        otpStorage.remove(email);

	        return ResponseEntity.ok("Password reset successfully.");
	    }
	
	
}
