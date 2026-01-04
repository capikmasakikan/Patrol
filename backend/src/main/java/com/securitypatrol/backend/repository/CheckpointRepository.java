package com.securitypatrol.backend.repository;

import com.securitypatrol.backend.model.Checkpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CheckpointRepository extends JpaRepository<Checkpoint, Long> {
    
    Optional<Checkpoint> findByNfcTagId(String nfcTagId);
    
    boolean existsByNfcTagId(String nfcTagId);
}