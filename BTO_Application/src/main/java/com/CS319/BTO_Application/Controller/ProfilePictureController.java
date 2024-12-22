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

    /**
     * Uploads a profile picture for a user.
     *
     * Preconditions:
     * - `username` must not be null and must correspond to an existing user.
     * - `file` must not be null and must be a valid image file.
     * - `file` size must not exceed 5MB.
     *
     * Postconditions:
     * - The profile picture is uploaded and saved for the user.
     * - Returns a success message.
     * - If the user does not exist, returns status 404 (NOT_FOUND).
     * - If the file size exceeds the limit, returns status 400 (BAD_REQUEST).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param username The username of the user.
     * @param file The profile picture file.
     * @return ResponseEntity containing the success message or error status.
     */
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


    /**
     * Retrieves the profile picture for a user.
     *
     * Preconditions:
     * - `username` must not be null and must correspond to an existing user.
     *
     * Postconditions:
     * - Returns the profile picture as a byte array.
     * - If the user does not exist or has no profile picture, returns status 404 (NOT_FOUND).
     * - If an error occurs, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param username The username of the user.
     * @return ResponseEntity containing the profile picture or error status.
     */
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
