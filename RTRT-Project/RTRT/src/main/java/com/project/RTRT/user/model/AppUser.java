package com.project.RTRT.user.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity
@Data
@NoArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, unique = true)
    private Integer userId;

    @Column(columnDefinition = "varchar(100)", unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @Size(min = 8, message = "Minimum password length: 8 characters")
    @JsonIgnore
    private String password;

    @Column(columnDefinition = "varchar(50)", nullable = false)
    private String firstName;

    @Column(columnDefinition = "varchar(50)", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private boolean registered;

    @Column(columnDefinition = "varchar(30)", nullable = false, unique = true)
    private String telephoneNumber;

    @Column
    private LocalDate birthDate;

    @Column(columnDefinition = "varchar(15)", nullable = false)
    @Enumerated(EnumType.STRING)
    AppUserRole appUserRoles = AppUserRole.ROLE_CLIENT;

}