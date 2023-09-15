package com.project.RTRT.reservationTime;

import com.project.RTRT.reservation.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalTime;

@Service
public class ReservationTimeService {

    @Autowired
    ReservationRepository reservationRepository;


    ReservationTime findByTime(LocalTime time) {

        return null;
    }

}
