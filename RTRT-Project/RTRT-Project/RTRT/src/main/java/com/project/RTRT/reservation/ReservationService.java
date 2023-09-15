package com.project.RTRT.reservation;

import com.project.RTRT.reservationTime.ReservationTime;
import com.project.RTRT.reservationTime.ReservationTimeRepository;
import com.project.RTRT.user.dto.ErrorMessage;
import com.project.RTRT.user.model.AppUser;
import com.project.RTRT.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    UserRepository userRepository;

    @Value("${maxCapacity}")
    private int maxCapacity;

    @Autowired
    ReservationTimeRepository reservationTimeRepository;

    public List<Reservation> getAllReservation() {
        return this.reservationRepository.findAll();
    }


    public List<Reservation> getActiveReservation(Integer userId) {
        LocalDate currentDate = LocalDate.now();
        List<Reservation> futureReservation = this.reservationRepository.findAllByAppUserUserIdAndReservationDateGreaterThanEqualAndStatusOrderByReservationDateAscStartTimeAsc(userId,
                currentDate, 0);
        List<Reservation> itemsToRemove = new ArrayList<>();
        for (Reservation reservation : futureReservation) {
            if (reservation.getReservationDate().isEqual(LocalDate.now())) {
                if (reservation.getStartTime().isBefore(LocalTime.now())) {
                    itemsToRemove.add(reservation);
                }
            }
        }
        futureReservation.removeAll(itemsToRemove);
        return futureReservation;
    }


    public List<Reservation> getAllActiveReservationForAdmin() {
        LocalDate currentDate = LocalDate.now();
        List<Reservation> futureReservation = this.reservationRepository.findAllByReservationDateGreaterThanEqualAndStatus(
                currentDate, 0);
        List<Reservation> itemsToRemove = new ArrayList<>();
        for (Reservation reservation : futureReservation) {
            if (reservation.getReservationDate().isEqual(LocalDate.now())) {
                if (reservation.getStartTime().isBefore(LocalTime.now())) {
                    itemsToRemove.add(reservation);
                }
            }
        }
        futureReservation.removeAll(itemsToRemove);
        return futureReservation;
    }

    public List<Reservation> getByDateAndTime(LocalDate date, LocalTime time) {
        return this.reservationRepository.findAllByReservationDateAndStartTimeAndStatus(date, time, 0);
    }

    public List<Reservation> getBetweenTwoDates(LocalDate date1, LocalDate date2) {
        return this.reservationRepository.findAllByReservationDateBetweenAndStatus(date1, date2, 0);
    }


    public ResponseEntity<?> addReservation(Reservation reservation) {

        // everywhere
        if (checkIfMonday(reservation)) {
            ErrorMessage errorMessage = new ErrorMessage();
            errorMessage.setMessage("We are closed");
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }

        //starts from 14, last reservation at 22
        if (!startTimeAllowed(reservation)) {
            ErrorMessage errorMessage = new ErrorMessage();
            errorMessage.setMessage("We are closed at this time");
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }

        adjustTimeOfReservation(reservation);

        Optional<AppUser> user = userRepository.findById(reservation.getAppUser().getUserId());

        user.ifPresent(reservation::setAppUser);
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        if (reservation.getReservationDate().isBefore(currentDate)) {
            ErrorMessage errorMessage = new ErrorMessage();
            errorMessage.setMessage("you can not make a reservation in the past");
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        } else if (reservation.getReservationDate().isEqual(currentDate)) {
            if (reservation.getStartTime().isBefore(currentTime)) {
                ErrorMessage errorMessage = new ErrorMessage();
                errorMessage.setMessage("you can not make a reservation in the past");
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
            } else {

                Reservation saved = this.reservationRepository.save(reservation);
                if (!addReservationTime(reservation)) {
                    ErrorMessage errorMessage = new ErrorMessage();
                    errorMessage.setMessage("max capacity exceeded");
                    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
                }

                return new ResponseEntity<>(saved, HttpStatus.CREATED);
            }
        } else {
            if (!addReservationTime(reservation)) {
                ErrorMessage errorMessage = new ErrorMessage();
                errorMessage.setMessage("max capacity exceeded");
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(this.reservationRepository.save(reservation), HttpStatus.CREATED);

        }
    }

    public ResponseEntity<?> updateReservation(Long id, Reservation reservation) {

        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        if (reservationRepository.findById(id).isPresent()) {
            Optional<Reservation> optionalReservation = this.reservationRepository.findById(id);
            Reservation existingReservation = optionalReservation.get();
            if (existingReservation.getReservationDate().isBefore(currentDate)) {
                ErrorMessage errorMessage = new ErrorMessage();
                errorMessage.setMessage("you can not update a reservation in the past");
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);

            } else if (existingReservation.getReservationDate().isEqual(currentDate)) {
                if (existingReservation.getStartTime().isBefore(currentTime)) {
                    ErrorMessage errorMessage = new ErrorMessage();
                    errorMessage.setMessage("you can not update a reservation in the past");
                    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
                } else {
                    if (reservation.getReservationDate().isBefore(currentDate)) {
                        ErrorMessage errorMessage = new ErrorMessage();
                        errorMessage.setMessage("you can not make a reservation in the past");
                        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
                    }

                    if (reservation.getReservationDate().isEqual(currentDate)) {
                        if (reservation.getStartTime().isBefore(currentTime)) {
                            ErrorMessage errorMessage = new ErrorMessage();
                            errorMessage.setMessage("you can not make a reservation in the past");
                            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
                        }
                        // delete the old number of person(existingReservation object) from the current capacity of this startTime
                        // than add the new number of person(from reservation object) to the current capacity
                        Optional<ReservationTime> reservationTime = reservationTimeRepository.findByDateAndTime(existingReservation.getReservationDate(), existingReservation.getStartTime());

                        reservationTime.ifPresent(time -> {
                            time.setCurrentCapacity(time.getCurrentCapacity() - existingReservation.getNumberOfPerson());
                            reservationTimeRepository.save(time);
                        });

                        reservation.setReservationId(id);
                        return addReservation(reservation);
                    } else {
                        Optional<ReservationTime> reservationTime = reservationTimeRepository.findByDateAndTime(existingReservation.getReservationDate(), existingReservation.getStartTime());
                        reservationTime.ifPresent(time -> {
                            time.setCurrentCapacity(time.getCurrentCapacity() - existingReservation.getNumberOfPerson());
                            reservationTimeRepository.save(time);

                        });

                        reservation.setReservationId(id);
                        return addReservation(reservation);
                    }
                }
            } else {
                if (reservation.getReservationDate().isBefore(currentDate)) {
                    ErrorMessage errorMessage = new ErrorMessage();
                    errorMessage.setMessage("you can not make a reservation in the past");
                    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
                } else if (reservation.getReservationDate().isEqual(currentDate)) {
                    if (reservation.getStartTime().isBefore(currentTime)) {
                        ErrorMessage errorMessage = new ErrorMessage();
                        errorMessage.setMessage("you can not make a reservation in the past");
                        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
                    } else {
                        Optional<ReservationTime> reservationTime = reservationTimeRepository.findByDateAndTime(existingReservation.getReservationDate(), existingReservation.getStartTime());
                        reservationTime.ifPresent(time -> {
                            time.setCurrentCapacity(time.getCurrentCapacity() - existingReservation.getNumberOfPerson());
                            reservationTimeRepository.save(time);
                        });

                        reservation.setReservationId(id);
                        return addReservation(reservation);
                    }
                } else {
                    Optional<ReservationTime> reservationTime = reservationTimeRepository.findByDateAndTime(existingReservation
                            .getReservationDate(), existingReservation.getStartTime());

                    reservationTime.ifPresent(time -> {
                                time.setCurrentCapacity(reservationTime.get().getCurrentCapacity() - existingReservation.getNumberOfPerson());
                                reservationTimeRepository.save(time);
                            }
                    );
                    reservation.setReservationId(id);
                    return addReservation(reservation);
                }
            }
        } else {
            ErrorMessage errorMessage = new ErrorMessage();
            errorMessage.setMessage("The reservation does not exist");
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }

    }


    public ResponseEntity<?> cancelReservation(Long id) {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        if (reservationRepository.findById(id).isPresent()) {
            Optional<Reservation> optionalReservation = this.reservationRepository.findById(id);
            Reservation reservation = optionalReservation.get();
            if (reservation.getReservationDate().isBefore(currentDate)) {
                ErrorMessage errorMessage = new ErrorMessage();
                errorMessage.setMessage("you can not cancel a reservation in the past");
                return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);

            } else if (reservation.getReservationDate().isEqual(currentDate)) {
                if (reservation.getStartTime().isBefore(currentTime)) {
                    ErrorMessage errorMessage = new ErrorMessage();
                    errorMessage.setMessage("you can not cancel a reservation in the past");
                    return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);

                } else {
                    reservation.setStatus(1);
                    reservation.setReservationId(id);
                    Optional<ReservationTime> reservationTime = reservationTimeRepository.findByDateAndTime(reservation.getReservationDate(), reservation.getStartTime());
                    reservationTime.ifPresent(time -> {
                        reservationTime.get().setCurrentCapacity(reservationTime.get().getCurrentCapacity() - reservation.getNumberOfPerson());
                        reservationTimeRepository.save(time);
                    });

                    return new ResponseEntity<>(this.reservationRepository.save(reservation), HttpStatus.OK);
                }
            } else {
                reservation.setStatus(1);
                reservation.setReservationId(id);
                Optional<ReservationTime> reservationTime = reservationTimeRepository.findByDateAndTime(reservation.getReservationDate(), reservation.getStartTime());
                reservationTime.ifPresent(time -> {
                    reservationTime.get().setCurrentCapacity(reservationTime.get().getCurrentCapacity() - reservation.getNumberOfPerson());
                    reservationTimeRepository.save(reservationTime.get());
                });

                return new ResponseEntity<>(this.reservationRepository.save(reservation), HttpStatus.OK);
            }

        } else {
            ErrorMessage errorMessage = new ErrorMessage();
            errorMessage.setMessage("The reservation does not exist");
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);

        }
    }

    private boolean startTimeAllowed(Reservation reservation) {
        return !reservation.getStartTime().isBefore(LocalTime.of(14, 0)) &&
                !reservation.getStartTime().isAfter(LocalTime.of(22, 0));
    }

    private boolean checkIfMonday(Reservation reservation) {
        LocalDate date = reservation.getReservationDate();
        if (date.getDayOfWeek() == DayOfWeek.MONDAY) {
            return true;
        }
        return false;
    }


    private void adjustTimeOfReservation(Reservation reservation) {

        reservation.setStartTime(LocalTime.of(reservation.getStartTime().getHour(), 0));

    }

    private boolean addReservationTime(Reservation reservation) {
        LocalDate date = reservation.getReservationDate();
        if (date.getDayOfWeek() == DayOfWeek.MONDAY) {
            return false;
        }
        Optional<ReservationTime> reservationTime = reservationTimeRepository.findByDateAndTime(reservation.getReservationDate(), reservation.getStartTime());
        boolean added;
        if (reservationTime.isEmpty()) {

            ReservationTime reservationTime1 = new ReservationTime();
            reservationTime1.setDate(reservation.getReservationDate());
            reservationTime1.setTime(reservation.getStartTime());
            reservationTime1.setCurrentCapacity(reservation.getNumberOfPerson());
            reservationTimeRepository.save(reservationTime1);
            added = true;

        } else {
            if (reservationTime.get().getCurrentCapacity() + reservation.getNumberOfPerson() > maxCapacity) {
                added = false;
            } else {
                reservationTime.get()
                        .setCurrentCapacity(reservationTime.get().getCurrentCapacity() + reservation.getNumberOfPerson());
                reservationTimeRepository.save(reservationTime.get());
                added = true;
            }
        }
        return added;
    }


}
