package com.CS319.BTO_Application.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class MailService {

    private final JavaMailSender mailSender;
    private final NotificationTemplateService templateService;

    @Autowired
    public MailService(JavaMailSender mailSender, NotificationTemplateService templateService) {
        this.mailSender = mailSender;
        this.templateService = templateService;
    }

    public void sendMail(String notificationType, String to) {
        // Fetch subject and text from NotificationTemplateService
        String subject = templateService.getSubject(notificationType);
        String text = templateService.getText(notificationType);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("btomailservice@gmail.com"); // Set the sender email here (use environment variable for better security)
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            mailSender.send(message);
        } catch (MailException e) {
            // Handle mail exception, you could log it or throw an exception
            e.printStackTrace();
        }
    }

}
