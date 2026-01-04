package com.securitypatrol.backend.controller;

import com.securitypatrol.backend.model.Guard;
import com.securitypatrol.backend.service.GuardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guards")
@CrossOrigin(origins = "*")
public class GuardController {
    
    @Autowired
    private GuardService guardService;
    
    @GetMapping
    public ResponseEntity<List<Guard>> getAllGuards() {
        return ResponseEntity.ok(guardService.getAllGuards());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Guard> getGuardById(@PathVariable Long id) {
        return guardService.getGuardById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createGuard(@RequestBody Guard guard) {
        try {
            Guard createdGuard = guardService.createGuard(guard);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGuard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGuard(@PathVariable Long id, @RequestBody Guard guard) {
        try {
            Guard updatedGuard = guardService.updateGuard(id, guard);
            return ResponseEntity.ok(updatedGuard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGuard(@PathVariable Long id) {
        try {
            guardService.deleteGuard(id);
            return ResponseEntity.ok(Map.of("message", "Guard deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/verify-pin")
    public ResponseEntity<?> verifyPin(@RequestBody Map<String, Object> request) {
        Long guardId = Long.valueOf(request.get("guardId").toString());
        String pin = request.get("pin").toString();
        
        boolean isValid = guardService.verifyPin(guardId, pin);
        
        if (isValid) {
            return guardService.getGuardById(guardId)
                    .map(guard -> ResponseEntity.ok(Map.of(
                            "message", "Login successful",
                            "guard", guard
                    )))
                    .orElse(ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid PIN"));
        }
    }
}