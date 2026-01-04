package com.securitypatrol.backend.repository;

import com.securitypatrol.backend.model.Patrol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PatrolRepository extends JpaRepository<Patrol, Long> {
    
    List<Patrol> findByGuardGuardIdOrderByScanTimeDesc(Long guardId);
    
    List<Patrol> findByScanTimeBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT p FROM Patrol p ORDER BY p.scanTime DESC")
    List<Patrol> findAllOrderByScanTimeDesc();
}