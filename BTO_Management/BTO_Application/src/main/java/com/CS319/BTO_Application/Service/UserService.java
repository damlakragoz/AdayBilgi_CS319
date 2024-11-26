package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.DTO.LoginRequest;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.CounselorRepos;
import com.CS319.BTO_Application.Repos.UserRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepos<User> userRepository;

    @Autowired
    public UserService(UserRepos<User> userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /*
    public User saveUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUserByUsername(String username) {
        if(userRepository.existsByUsername(username)) {
            userRepository.deleteByUsername(username);
        } else {
            throw new UsernameNotFoundException("User not found: " + username);
        }    }

     */

}

