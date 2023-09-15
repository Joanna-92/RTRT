package com.project.RTRT.user.controller;

import com.project.RTRT.security.exception.CustomException;
import com.project.RTRT.user.dto.ErrorMessage;
import com.project.RTRT.user.dto.UserDataDTO;
import com.project.RTRT.user.dto.UserResponseDTO;
import com.project.RTRT.user.dto.UserSignInDTO;
import com.project.RTRT.user.dto.UserToken;
import com.project.RTRT.user.model.AppUser;
import com.project.RTRT.user.model.AppUserRole;
import com.project.RTRT.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final ModelMapper modelMapper;

    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody UserSignInDTO userSignInDTO) {
        try {
            String signinToken = userService.signin(userSignInDTO.getEmail(), userSignInDTO.getPassword());
            UserToken userToken = new UserToken();
            userToken.setToken(signinToken);
            return new ResponseEntity<>(userToken, HttpStatus.OK);
        } catch (CustomException e) {
            ErrorMessage errorMessage = new ErrorMessage();
            errorMessage.setMessage(e.getMessage());
            HttpStatus status = e.getHttpStatus();
            return new ResponseEntity<>(errorMessage, status);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDataDTO user) {

        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            ErrorMessage errorMessage = new ErrorMessage();
            errorMessage.setMessage("Invalid Email");
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }
        try {
            AppUser userToSave = modelMapper.map(user, AppUser.class);
            userToSave.setRegistered(true);
            userToSave.setAppUserRoles(AppUserRole.ROLE_CLIENT);
            String signupToken = userService.signup(userToSave);
            UserToken userToken = new UserToken();
            userToken.setToken(signupToken);

            return new ResponseEntity<>(userToken, HttpStatus.OK);
        } catch (CustomException e) {
            ErrorMessage errorMessage = new ErrorMessage();
            errorMessage.setMessage(e.getMessage());
            HttpStatus status = e.getHttpStatus();
            return new ResponseEntity<>(errorMessage, status);
        }
    }

    @GetMapping("findByName")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Optional<AppUser> getCustomerByName(@RequestParam String firstname, @RequestParam String lastname) {
        return userService.getCustomerByName(firstname, lastname);
    }


    @DeleteMapping(value = "/{email}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String delete(@PathVariable String email) {
        userService.delete(email);
        return email;
    }


    @GetMapping(value = "/{email}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public UserResponseDTO searchByEmail(@PathVariable String email) {
        return modelMapper.map(userService.searchByEmail(email), UserResponseDTO.class);
    }

    @PutMapping("update/{id}")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public ResponseEntity<AppUser> updateCustomer(@PathVariable Integer id, @RequestBody AppUser user) {
        return userService.updateCustomer(id, user);
    }

    @GetMapping(value = "/myInfo")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLIENT')")
    public UserResponseDTO getMyInfo(HttpServletRequest req) {
        return modelMapper.map(userService.getMyInfo(req), UserResponseDTO.class);
    }


    @GetMapping("/refresh")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLIENT')")
    public String refresh(HttpServletRequest req) {
        return userService.refresh(req.getRemoteUser());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<AppUser> listAll() {
        return userService.listAll();
    }

}