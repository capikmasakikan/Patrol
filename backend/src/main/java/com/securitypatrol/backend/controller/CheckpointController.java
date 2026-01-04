package com.securitypatrol.backend.controller;

import com.securitypatrol.backend.model.Checkpoint;
import com.securitypatrol.backend.service.CheckpointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checkpoints")
@CrossOrigin(origins = "*")
public class CheckpointController {
    
    @Autowired
    private CheckpointService checkpointService;
    
    @GetMapping
    public ResponseEntity<List<Checkpoint>> getAllCheckpoints() {
        return ResponseEntity.ok(checkpointService.getAllCheckpoints());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Checkpoint> getCheckpointById(@PathVariable Long id) {
        return checkpointService.getCheckpointById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/nfc/{nfcTagId}")
    public ResponseEntity<Checkpoint> getCheckpointByNfcTagId(@PathVariable String nfcTagId) {
        return checkpointService.getCheckpointByNfcTagId(nfcTagId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createCheckpoint(@RequestBody Checkpoint checkpoint) {
        try {
            Checkpoint createdCheckpoint = checkpointService.createCheckpoint(checkpoint);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCheckpoint);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCheckpoint(@PathVariable Long id, @RequestBody Checkpoint checkpoint) {
        try {
            Checkpoint updatedCheckpoint = checkpointService.updateCheckpoint(id, checkpoint);
            return ResponseEntity.ok(updatedCheckpoint);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCheckpoint(@PathVariable Long id) {
        try {
            checkpointService.deleteCheckpoint(id);
            return ResponseEntity.ok(Map.of("message", "Checkpoint deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}