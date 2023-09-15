package com.project.RTRT.configuration;


import com.project.RTRT.reservation.Reservation;
import com.project.RTRT.reservation.ReservationRepository;
import com.project.RTRT.reservation.ReservationService;
import com.project.RTRT.reservationTime.ReservationTime;
import com.project.RTRT.reservationTime.ReservationTimeRepository;
import com.project.RTRT.user.model.AppUser;
import com.project.RTRT.user.model.AppUserRole;
import com.project.RTRT.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DatabaseLoader implements CommandLineRunner {


    @Autowired
    UserService userService;
    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    ReservationService reservationService;

    @Autowired
    ReservationTimeRepository reservationTimeRepository;

    @Override
    public void run(String... args) throws Exception {

        AppUser admin = new AppUser();
        admin.setPassword("adminadmin");
        admin.setEmail("admin@gmail.com");
        admin.setFirstName("Abdul");
        admin.setLastName("Oudeh");
        admin.setTelephoneNumber("123456789");
        admin.setRegistered(true);
        admin.setAppUserRoles(AppUserRole.ROLE_ADMIN);
        userService.signup(admin);

        AppUser client = new AppUser();
        client.setPassword("clientclient");
        client.setEmail("client@gmail.com");
        client.setFirstName("max");
        client.setLastName("mustermann");
        client.setTelephoneNumber("012345678");
        client.setRegistered(true);
        client.setBirthDate(LocalDate.of(1998, 8, 20));
        client.setAppUserRoles(AppUserRole.ROLE_CLIENT);
        userService.signup(client);


        Reservation reservation = new Reservation();
        reservation.setStartTime(LocalTime.of(16, 0));
        reservation.setNumberOfPerson(4);
        reservation.setAppUser(client);
        reservation.setReservationDate(LocalDate.of(2023, 10, 18));
        reservationRepository.save(reservation);

        ReservationTime reservationTime = new ReservationTime();
        reservationTime.setDate(LocalDate.of(2023, 10, 18));
        reservationTime.setTime(LocalTime.of(16, 0));
        reservationTime.setCurrentCapacity(4);
        reservationTimeRepository.save(reservationTime);


        Reservation reservation2 = new Reservation();
        reservation2.setStartTime(LocalTime.of(15, 0));
        reservation2.setNumberOfPerson(8);
        reservation2.setAppUser(client);
        reservation2.setReservationDate(LocalDate.of(2023, 6, 21));
        reservationRepository.save(reservation2);

        ReservationTime reservationTime2 = new ReservationTime();
        reservationTime2.setDate(LocalDate.of(2023, 6, 21));
        reservationTime2.setTime(LocalTime.of(15, 0));
        reservationTime2.setCurrentCapacity(8);
        reservationTimeRepository.save(reservationTime2);

    }
}