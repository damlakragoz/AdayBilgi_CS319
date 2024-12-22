package com.CS319.BTO_Application.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends an email using the provided recipient, subject, and message body.
     *
     * Preconditions:
     * - `to` must not be null or empty.
     * - `subject` must not be null or empty.
     * - `text` must not be null or empty.
     *
     * Postconditions:
     * - Attempts to send the email using the configured mail sender.
     * - If an error occurs during sending, an error message is logged, and the exception is caught.
     *
     * @param to The recipient's email address.
     * @param subject The subject of the email.
     * @param text The body of the email.
     */
    public void sendMail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("btomailservice@gmail.com"); // Set the sender email here (use environment variable for better security)
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            mailSender.send(message);
        } catch (MailException e) {
            System.out.println(String.format("Unable to send email to %s. Reason: %s", to, e.getMessage()));
        }
    }

}
