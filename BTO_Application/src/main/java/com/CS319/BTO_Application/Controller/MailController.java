package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.Service.MailService;
import com.CS319.BTO_Application.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    private final MailService mailService;
    private final UserService userService;

    @Autowired
    public MailController(MailService mailService, UserService userService) {
        this.mailService = mailService;
        this.userService = userService;
    }

    /**
     * Sends the user's password to their email.
     *
     * Preconditions:
     * - `email` must not be null and must correspond to an existing user.
     *
     * Postconditions:
     * - Sends an email containing the user's password.
     * - Returns a boolean indicating success or failure.
     * - If the email does not correspond to an existing user, returns status 400 (BAD_REQUEST).
     * - If an error occurs while sending the email, returns status 500 (INTERNAL_SERVER_ERROR).
     *
     * @param email The email address of the user.
     * @return ResponseEntity containing a boolean value indicating success or failure.
     */
    @PostMapping("/send-password")
    public ResponseEntity<?> sendPassword(@RequestParam String email) {
        boolean result = false;
        String password = userService.getUserByUsername(email).getPassword();
        if (password == null) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }

        String subject = "BTO Şifre Gönderimi";
        String text = "Sevgili Kullanıcı,\n\nŞifreniz: " + password + "\n\nLütfen en kısa sürede şifrenizi değiştiriniz.";

        try {
            mailService.sendMail(email, subject, text);
            result = true;
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            result = false;
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
