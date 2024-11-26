package com.CS319.BTO_Application.Service;

import com.CS319.BTO_Application.Entity.Counselor;
import com.CS319.BTO_Application.Entity.User;
import com.CS319.BTO_Application.Repos.CounselorRepos;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CounselorService {
    private final CounselorRepos counselorRepos;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public CounselorService(CounselorRepos counselorRepos, PasswordEncoder passwordEncoder) {
        this.counselorRepos = counselorRepos;
        this.passwordEncoder = passwordEncoder;
    }


    public Counselor getCounselorByUsername(String username) {
        if(!counselorRepos.existsByUsername(username)){
            System.out.println("Counselor Not Found with username " + username);
            return null;
        }
        return counselorRepos.findByUsername(username);
    }

    public Counselor saveCounselor(Counselor counselor) {
        counselor.setPassword(passwordEncoder.encode(counselor.getPassword())); //setPassword is new for this one
        return counselorRepos.save(counselor);
    }

    @Transactional
    public void deleteCounselorByUsername(String username) {
        if(counselorRepos.existsByUsername(username)) {
            counselorRepos.deleteByUsername(username);
        } else {
            throw new UsernameNotFoundException("Counselor not found: " + username);
        }    }
}
