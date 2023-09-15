package com.project.RTRT.reservation;

import com.project.RTRT.user.model.AppUser;
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

public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, unique = true)
    private Long reservationId;

    @Column(nullable = false)
    private LocalDate reservationDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, columnDefinition = "integer default 0 ")
    @Min(0)
    @Max(2)
    private int status;// this variable has the value 0 =confirmed ,1 = cancelled,2 = did not show up

    @Column(name = "nr_person", nullable = false)
    @Min(1)
    @Max(10)
    private int numberOfPerson;

    @Column(columnDefinition = "varchar(200)")
    private String comment;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false, updatable = false)
    private AppUser appUser;

    public Reservation() {
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
        setEndTime(startTime.plusHours(1));
    }

}
