package com.securitypatrol.backend.service;

import com.securitypatrol.backend.model.Patrol;
import com.securitypatrol.backend.model.Guard;
import com.securitypatrol.backend.model.Checkpoint;
import com.securitypatrol.backend.repository.PatrolRepository;
import com.securitypatrol.backend.repository.GuardRepository;
import com.securitypatrol.backend.repository.CheckpointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PatrolService {
    
    @Autowired
    private PatrolRepository patrolRepository;
    
    @Autowired
    private GuardRepository guardRepository;
    
    @Autowired
    private CheckpointRepository checkpointRepository;
    
    public List<Patrol> getAllPatrols() {
        return patrolRepository.findAllOrderByScanTimeDesc();
    }
    
    public List<Patrol> getPatrolsByGuard(Long guardId) {
        return patrolRepository.findByGuardGuardIdOrderByScanTimeDesc(guardId);
    }
    
    public List<Patrol> getPatrolsByDateRange(LocalDateTime start, LocalDateTime end) {
        return patrolRepository.findByScanTimeBetween(start, end);
    }
    
    public Patrol createPatrol(Long guardId, String nfcTagId, String notes) {
        Guard guard = guardRepository.findById(guardId)
                .orElseThrow(() -> new RuntimeException("Guard not found"));
        
        Checkpoint checkpoint = checkpointRepository.findByNfcTagId(nfcTagId)
                .orElseThrow(() -> new RuntimeException("Checkpoint not found with NFC Tag ID: " + nfcTagId));
        
        Patrol patrol = new Patrol();
        patrol.setGuard(guard);
        patrol.setCheckpoint(checkpoint);
        patrol.setNotes(notes);
        
        return patrolRepository.save(patrol);
    }
    
    public void deletePatrol(Long id) {
        patrolRepository.deleteById(id);
    }
}