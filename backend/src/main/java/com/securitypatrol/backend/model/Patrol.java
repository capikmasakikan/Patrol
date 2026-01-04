package com.securitypatrol.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "patrols")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patrol {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long patrolId;
    
    @ManyToOne
    @JoinColumn(name = "guard_id", nullable = false)
    private Guard guard;
    
    @ManyToOne
    @JoinColumn(name = "checkpoint_id", nullable = false)
    private Checkpoint checkpoint;
    
    @Column(name = "scan_time")
    private LocalDateTime scanTime;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @PrePersist
    protected void onCreate() {
        scanTime = LocalDateTime.now();
    }
}