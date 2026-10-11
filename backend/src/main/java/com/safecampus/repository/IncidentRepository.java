package com.safecampus.repository;
import com.safecampus.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
public interface IncidentRepository extends JpaRepository<Incident,Long>{ long countByStatus(String status); long countByPriority(String priority); }
