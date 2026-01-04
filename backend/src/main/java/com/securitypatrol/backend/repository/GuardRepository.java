package com.securitypatrol.backend.repository;

import com.securitypatrol.backend.model.Guard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GuardRepository extends JpaRepository<Guard, Long> {
    
    Optional<Guard> findByName(String name);
    
    boolean existsByEmail(String email);
}