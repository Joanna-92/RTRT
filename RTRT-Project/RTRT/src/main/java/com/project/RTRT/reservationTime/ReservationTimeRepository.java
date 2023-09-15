package com.project.RTRT.reservationTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Repository
public interface ReservationTimeRepository extends JpaRepository<ReservationTime, Long> {

    Optional<ReservationTime> findByDateAndTime(LocalDate date, LocalTime time);

    ReservationTime findByTime(LocalTime time);
}
