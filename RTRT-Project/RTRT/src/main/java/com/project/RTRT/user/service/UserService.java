package com.project.RTRT.user.service;


import com.project.RTRT.security.JwtTokenProvider;
import com.project.RTRT.security.exception.CustomException;
import com.project.RTRT.user.model.AppUser;
import com.project.RTRT.user.model.AppUserRole;
import com.project.RTRT.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public String signin(String email, String password) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            return jwtTokenProvider.createToken(email, userRepository.findByEmail(email).getAppUserRoles());
        } catch (AuthenticationException e) {

            throw new CustomException("Invalid username or password supplied", HttpStatus.BAD_REQUEST);
        }
    }

    public String signup(AppUser appUser) {

        if (!userRepository.existsByEmail(appUser.getEmail())) {
            appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));
            userRepository.save(appUser);
            return jwtTokenProvider.createToken(appUser.getEmail(), appUser.getAppUserRoles());
        } else {
            throw new CustomException("Email is already in use", HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    public ResponseEntity<AppUser> updateCustomer(Integer id, AppUser user) {
        if (this.userRepository.findById(id).isPresent()) {
            Optional<AppUser> existingUser = userRepository.findById(id);

            user.setUserId(id);
            user.setRegistered(true);
            user.setAppUserRoles(AppUserRole.ROLE_CLIENT);
            user.setEmail(existingUser.get().getEmail());
            user.setBirthDate(existingUser.get().getBirthDate());
            if (user.getPassword() == null) {
                user.setPassword(existingUser.get().getPassword());
            }

            return new ResponseEntity<>(this.userRepository.save(user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    public void delete(String email) {
        userRepository.deleteByEmail(email);
    }

    public AppUser searchByEmail(String email) {
        AppUser appUser = userRepository.findByEmail(email);
        if (appUser == null) {
            throw new CustomException("The user doesn't exist", HttpStatus.NOT_FOUND);
        }
        return appUser;
    }


    public List<AppUser> listAll() {
        return userRepository.findAll();

    }

    public Optional<AppUser> getCustomerByName(String firstname, String lastname) {
        return this.userRepository.findByFirstNameAndLastName(firstname, lastname);
    }

    public AppUser getMyInfo(HttpServletRequest req) {
        return userRepository.findByEmail(jwtTokenProvider.getEmail(jwtTokenProvider.resolveToken(req)));
    }

    public String refresh(String email) {
        return jwtTokenProvider.createToken(email, userRepository.findByEmail(email).getAppUserRoles());
    }
}
