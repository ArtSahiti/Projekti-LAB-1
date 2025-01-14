package com.erinart.HotelB.repo;


import com.erinart.HotelB.entity.Email;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailRepository extends JpaRepository<Email, Long> {
}
