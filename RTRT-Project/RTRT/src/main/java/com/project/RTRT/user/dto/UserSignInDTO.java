package com.project.RTRT.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@NoArgsConstructor
public class UserSignInDTO {

    private String email;
    private String password;


}