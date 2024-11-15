package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.UserRepos;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;

@Service
public class UserService implements UserDetailsService {
    private final UserRepos userRepository;

    public UserService(UserRepos userRepository) {
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
    public User saveUser(User user){
        return userRepository.save(user);
    }

}