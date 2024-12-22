package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfilePictureController {

    @Autowired
    private UserService userService;

    @PostMapping("/upload-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestParam("username") String username,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.getSize() > 5 * 1024 * 1024) { // Limit to 5 MB
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File size exceeds the 5MB limit.");
            }

            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            user.setProfilePicture(file.getBytes());
            userService.saveUser(user); // Save updated user with profile picture

            return ResponseEntity.ok("Profile picture uploaded successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload picture: " + e.getMessage());
        }
    }


    @GetMapping("/get-picture")
    public ResponseEntity<byte[]> getProfilePicture(@RequestParam("username") String username) {
        try {
            User user = userService.getUserByUsername(username);
            if (user == null || user.getProfilePicture() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(user.getProfilePicture());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
