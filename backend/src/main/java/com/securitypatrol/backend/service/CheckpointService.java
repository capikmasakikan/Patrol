package com.securitypatrol.backend.service;

import com.securitypatrol.backend.model.Checkpoint;
import com.securitypatrol.backend.repository.CheckpointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CheckpointService {
    
    @Autowired
    private CheckpointRepository checkpointRepository;
    
    public List<Checkpoint> getAllCheckpoints() {
        return checkpointRepository.findAll();
    }
    
    public Optional<Checkpoint> getCheckpointById(Long id) {
        return checkpointRepository.findById(id);
    }
    
    public Optional<Checkpoint> getCheckpointByNfcTagId(String nfcTagId) {
        return checkpointRepository.findByNfcTagId(nfcTagId);
    }
    
    public Checkpoint createCheckpoint(Checkpoint checkpoint) {
        if (checkpointRepository.existsByNfcTagId(checkpoint.getNfcTagId())) {
            throw new RuntimeException("NFC Tag ID already exists");
        }
        return checkpointRepository.save(checkpoint);
    }
    
    public Checkpoint updateCheckpoint(Long id, Checkpoint checkpointDetails) {
        Checkpoint checkpoint = checkpointRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checkpoint not found"));
        
        checkpoint.setNfcTagId(checkpointDetails.getNfcTagId());
        checkpoint.setCheckpointName(checkpointDetails.getCheckpointName());
        checkpoint.setBuilding(checkpointDetails.getBuilding());
        checkpoint.setFloor(checkpointDetails.getFloor());
        checkpoint.setDescription(checkpointDetails.getDescription());
        
        return checkpointRepository.save(checkpoint);
    }
    
    public void deleteCheckpoint(Long id) {
        checkpointRepository.deleteById(id);
    }
}