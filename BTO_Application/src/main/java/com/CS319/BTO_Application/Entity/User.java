package com.CS319.BTO_Application.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
@Entity
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",unique = true, nullable = false)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "role", nullable = false)
    private String role; // e.g., "ROLE_USER", "ROLE_ADMIN"

    @Lob
    @Column(name = "profile_picture", columnDefinition = "LONGBLOB", nullable = true)
    private byte[] profilePicture;

    /*
    TODO: these will be added
    - mailService: MailService
    - notifier: Notifier
    - notifications: List<Notification>
    - authenticationService: AuthenticationService
     */
    public User(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
    public User() {

    }
}
