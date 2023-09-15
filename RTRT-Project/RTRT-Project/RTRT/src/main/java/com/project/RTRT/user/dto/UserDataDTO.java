package com.project.RTRT.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@NoArgsConstructor
public class UserDataDTO {

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String telephoneNumber;

}