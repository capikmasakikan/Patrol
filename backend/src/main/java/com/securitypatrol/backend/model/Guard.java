package com.securitypatrol.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "guards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guardId;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(length = 20)
    private String phone;
    
    @Column(length = 100)
    private String email;
    
    @Column(length = 20)
    private String shift;
    
    @Column(nullable = false, length = 255)
    private String pin;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}