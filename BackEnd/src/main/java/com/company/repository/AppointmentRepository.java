// src/main/java/com/company/repository/AppointmentRepository.java
package com.company.repository;

import com.company.entity.appontment.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
