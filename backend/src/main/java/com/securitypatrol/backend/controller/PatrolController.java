package com.securitypatrol.backend.controller;

import com.securitypatrol.backend.model.Patrol;
import com.securitypatrol.backend.service.PatrolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patrols")
@CrossOrigin(origins = "*")
public class PatrolController {
    
    @Autowired
    private PatrolService patrolService;
    
    @GetMapping
    public ResponseEntity<List<Patrol>> getAllPatrols() {
        return ResponseEntity.ok(patrolService.getAllPatrols());
    }
    
    @GetMapping("/guard/{guardId}")
    public ResponseEntity<List<Patrol>> getPatrolsByGuard(@PathVariable Long guardId) {
        return ResponseEntity.ok(patrolService.getPatrolsByGuard(guardId));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Patrol>> getPatrolsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(patrolService.getPatrolsByDateRange(start, end));
    }
    
    @PostMapping
    public ResponseEntity<?> createPatrol(@RequestBody Map<String, Object> request) {
        try {
            Long guardId = Long.valueOf(request.get("guard_id").toString());
            String nfcTagId = request.get("nfc_tag_id").toString();
            String notes = request.getOrDefault("notes", "").toString();
            
            Patrol patrol = patrolService.createPatrol(guardId, nfcTagId, notes);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Patrol recorded successfully",
                    "patrol_id", patrol.getPatrolId(),
                    "scan_time", patrol.getScanTime()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatrol(@PathVariable Long id) {
        try {
            patrolService.deletePatrol(id);
            return ResponseEntity.ok(Map.of("message", "Patrol deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}