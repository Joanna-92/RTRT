package com.project.RTRT.reservation;


import com.project.RTRT.user.model.AppUser;
import com.project.RTRT.user.repository.UserRepository;
import com.project.RTRT.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RequiredArgsConstructor

@RestController
@RequestMapping(path = "reservation")
public class ReservationController {
    private final PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ReservationService reservationService;

    @Autowired
    UserService userService;

    @Autowired
    ReservationRepository reservationRepository;


    @GetMapping("findAllActiveReservation")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Reservation> getAllActiveReservationForAdmin() {
        // get all active reservation for admin
        return reservationService.getAllActiveReservationForAdmin();
    }

    @GetMapping("findUserReservations")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLIENT')")
    public List<Reservation> findReservationsForUser(HttpServletRequest req) {
        // get all active reservation for the logged in user
        AppUser loggedInUser = userService.getMyInfo(req);
        return reservationService.getActiveReservation(loggedInUser.getUserId());
    }


    @GetMapping("findByDateAndTime")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Reservation> getByDateAndTime(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                              @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time) {
        return reservationService.getByDateAndTime(date, time);
    }

    @GetMapping("findBetweenTwoDates")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Reservation> getBetweenTwoDates(@RequestParam("date1") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date1,
                                                @RequestParam("date2") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date2) {
        return reservationService.getBetweenTwoDates(date1, date2);
    }

    @PostMapping("add")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    public ResponseEntity<?> addReservation(@RequestBody Reservation reservation) {
        // Add a new reservation
        return reservationService.addReservation(reservation);
    }

    @PostMapping("admin/add")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> adminAddReservation(@RequestBody Reservation reservation,
                                                 @RequestParam(name = "firstName", required = false) String firstName,
                                                 @RequestParam(name = "lastName", required = false) String lastName,
                                                 @RequestParam(name = "telephoneNumber", required = false) String telephoneNumber
    ) {
        // Add a new reservation for admin
        if (userRepository.findByFirstNameAndLastNameAndTelephoneNumber(firstName, lastName, telephoneNumber).isPresent()) {
            Optional<AppUser> existingCustomer = userRepository.findByFirstNameAndLastNameAndTelephoneNumber(firstName, lastName, telephoneNumber);
            reservation.setAppUser(existingCustomer.get());
            return reservationService.addReservation(reservation);
        } else {
            AppUser guest = new AppUser();
            guest.setFirstName(firstName);
            guest.setLastName(lastName);
            guest.setTelephoneNumber(telephoneNumber);
            guest.setRegistered(false);
            Random random = new Random();
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + random.nextInt(20000) + "@customer.com";
            guest.setEmail(email);
            guest.setPassword(passwordEncoder.encode(firstName + "." + lastName));
            AppUser saved = userRepository.saveAndFlush(guest);
            reservation.setAppUser(saved);
            return reservationService.addReservation(reservation);

        }

    }


    @PutMapping("update/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLIENT')")
    public ResponseEntity<?> updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) {
        // the customer can update his reservation
        return reservationService.updateReservation(id, reservation);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLIENT')")
    // get reservation by id
    public ResponseEntity<?> getReservationPerId(@PathVariable Long id) {
        System.out.println(id);
        return new ResponseEntity<>(reservationRepository.findById(id).get(), HttpStatus.OK);
    }

    @PutMapping("cancel/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CLIENT')")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        // the customer can cancel his reservation but the reservation should be stored in the databases
        // so we just change the status
        return reservationService.cancelReservation(id);
    }

}
