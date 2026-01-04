package com.securitypatrol.backend.service;

import com.securitypatrol.backend.model.Guard;
import com.securitypatrol.backend.repository.GuardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GuardService {
    
    @Autowired
    private GuardRepository guardRepository;
    
    
    public List<Guard> getAllGuards() {
        return guardRepository.findAll();
    }
    
    public Optional<Guard> getGuardById(Long id) {
        return guardRepository.findById(id);
    }
    
    public Guard createGuard(Guard guard) {
        // Hash the PIN before saving
       // guard.setPin(passwordEncoder.encode(guard.getPin()));
        return guardRepository.save(guard);
    }
    
    public Guard updateGuard(Long id, Guard guardDetails) {
        Guard guard = guardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guard not found"));
        
        guard.setName(guardDetails.getName());
        guard.setPhone(guardDetails.getPhone());
        guard.setEmail(guardDetails.getEmail());
        guard.setShift(guardDetails.getShift());
        
        // Only update PIN if provided
        if (guardDetails.getPin() != null && !guardDetails.getPin().isEmpty()) {
            guard.setPin(guardDetails.getPin());
        }
        
        return guardRepository.save(guard);
    }
    
    public void deleteGuard(Long id) {
        guardRepository.deleteById(id);
    }
    
    public boolean verifyPin(Long guardId, String pin) {
        Optional<Guard> guard = guardRepository.findById(guardId);
        if (guard.isPresent()) {
            return pin.equals(guard.get().getPin());
        }
        return false;
    }
}