package com.CS319.BTO_Application.Service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationTemplateService {

    private final Map<String, String> subjects = new HashMap<>();
    private final Map<String, String> texts = new HashMap<>();

    public NotificationTemplateService() {
        initializeTemplates();
    }

    // Initialize templates
    private void initializeTemplates() {
        // Subjects
        subjects.put("Guide, Tour Approved", "Tur İsteğin Onaylandı");
        subjects.put("Counselor, Tour Approved", "Üniversite Turu İsteğiniz Onaylandı");
        subjects.put("Guide Tour, Rejected", "Tur İsteğin Reddedildi");
        subjects.put("Counselor, Tour Rejected", "Üniversite Turu İsteğiniz Reddedildi");
        subjects.put("Executive, Fair Approved", "Lise Fuarına Gitme İsteğiniz Onaylandı");
        subjects.put("Guide, Fair Approved", "Lise Fuarına Gitme İsteğiniz Onaylandı");
        subjects.put("Counselor, Fair Approved", "Lise Fuarına Olan Davetiniz Onaylandı");
        subjects.put("Guide, Tour Schedule Finalized", "Tur Takvimi Belirlendi");
        subjects.put("Guide, Your Withdrawn Tour Approved", "Turdan Çekilme İsteğiniz Danışman Tarafından Kabul Edildi");
        subjects.put("Advisor, Withdrawn Tour Approved", "Çekilmiş Turu Kabul Ettiniz");
        subjects.put("Guide, Your Withdrawn Tour Rejected", "Turdan Çekilme İsteğiniz Danışman Tarafından Reddedildi");
        subjects.put("Guide, Scheduled Tour Canceled", "Onaylanan Turunuz Lise Tarafından İptal Edildi");
        subjects.put("Counselor, Scheduled Tour Canceled", "Onaylanan Üniversite Turunuzu İptal Ettiniz");

        // Texts
        texts.put("Guide, Tour Approved", "Tur Bilgisi: \n");
        texts.put("Counselor, Tour Approved", "Tur Bilgisi: \n");
        texts.put("Guide, Tour Rejected", "Bazı teknik aksaklıklardan dolayı turunuz kabul edilememiştir.");
        texts.put("Counselor, Tour Rejected", "Ne yazık ki  zaman yetersizliğinden dolayı tur isteğiniz kabul edilememiştir.");
        texts.put("Executive, Fair Approved", "Fuar Bilgisi: \n");
        texts.put("Guide, Fair Approved", "Fuar Bilgisi: \n");
        texts.put("Counselor, Fair Approved", "Fuar Bilgisi: \n");
        texts.put("Guide, Tour Schedule Finalized", "Tur takvimine web sayfamızdan erişebilirsiniz.");
        texts.put("Guide, Your Withdrawn Tour Approved", "Tur Bilgisi: \n");
        texts.put("Advisor, Withdrawn Tour Approved", "Tur Bilgisi: \n");
        texts.put("Guide, Your Withdrawn Tour Rejected", "Tur Bilgisi: \n");
        texts.put("Guide, Scheduled Tour Canceled", "Tur Bilgisi: \n");
        texts.put("Counselor, Scheduled Tour Canceled", "Tur Bilgisi: \n");
    }

    // Get subject for a given notification type
    public String getSubject(String notificationType) {
        return subjects.getOrDefault(notificationType, "Default Subject");
    }

    // Get text for a given notification type
    public String getText(String notificationType) {
        return texts.getOrDefault(notificationType, "Default notification message.");
    }
}
