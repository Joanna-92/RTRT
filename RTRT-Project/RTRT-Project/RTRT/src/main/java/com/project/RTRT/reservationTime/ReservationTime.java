package com.project.RTRT.reservationTime;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDate;
import java.time.LocalTime;


@Getter
@Setter
@Entity
public class ReservationTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, unique = true)
    private Long id;

    @Column(nullable = false)
    private LocalTime time;


    @Column(nullable = false)
    private LocalDate date;

    @Min(0)
    @Max(70)
    private int currentCapacity = 0;


}
