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
     * Endpoint to send the user's password to their email.
     * @param email The email address of the user.
     * @return A ResponseEntity with a boolean value indicating success or failure.
     */
    @PostMapping("/send-password")
    public ResponseEntity<?> sendPassword(@RequestParam String email) {
        String password = userService.getUserByUsername(email).getPassword();
        if (password == null) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }

        String subject = "BTO Şifre Gönderimi";
        String text = "Sevgili Kullanıcı,\n\nŞifreniz: " + password + "\n\nLütfen en kısa sürede şifrenizi değiştiriniz.";

        boolean result = false;
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

