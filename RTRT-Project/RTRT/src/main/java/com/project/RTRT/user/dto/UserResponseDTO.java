package com.project.RTRT.user.dto;


import java.time.LocalDate;
import java.util.List;

import com.project.RTRT.user.model.AppUserRole;
import lombok.Data;

@Data
public class UserResponseDTO {

    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate birthDate;
    AppUserRole appUserRoles;

}