package com.safecampus.service;

import com.safecampus.entity.Incident;
import com.safecampus.repository.IncidentRepository;
import com.safecampus.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class IncidentService {

    private final IncidentRepository repo;
    private final UserRepository users;

    public IncidentService(IncidentRepository repo, UserRepository users) {
        this.repo = repo;
        this.users = users;
    }

    public List<Incident> all() {
        return repo.findAll();
    }

    public Incident create(Incident i, Long reporterId) {

        i.setStatus("RECEIVED");

        i.setAssignedTeam(
            route(i.getCategory())
        );

        if (i.getPriority() == null || i.getPriority().isBlank()) {
            i.setPriority(
                classifyPriority(
                    i.getDescription(),
                    i.getCategory()
                )
            );
        }

        if (reporterId != null) {
            users.findById(reporterId)
                 .ifPresent(i::setReporter);
        }

        return repo.save(i);
    }

    private String route(String category) {

        if (category == null) {
            return "Campus Security";
        }

        return switch (category.toUpperCase()) {

            case "MEDICAL" ->
                "Campus Medical Team";

            case "FIRE", "SUSPICIOUS" ->
                "Campus Security";

            case "ELECTRICAL", "INFRASTRUCTURE" ->
                "Maintenance Team";

            default ->
                "Campus Security";
        };
    }

    private String classifyPriority(String description, String category) {

        String x = (description + " " + category).toLowerCase();

        if (x.contains("fire")
                || x.contains("unconscious")
                || x.contains("accident")
                || x.contains("emergency")) {

            return "HIGH";
        }

        if (x.contains("urgent")
                || x.contains("danger")) {

            return "MEDIUM";
        }

        return "LOW";
    }

    public Incident status(Long id, String status) {

        Incident i = repo.findById(id)
                .orElseThrow();

        i.setStatus(status);

        return repo.save(i);
    }

    public Incident assign(Long id, String team) {

        Incident i = repo.findById(id)
                .orElseThrow();

        i.setAssignedTeam(team);
        i.setStatus("ASSIGNED");

        return repo.save(i);
    }

    public Map<String, Object> stats() {

        return Map.of(
            "total", repo.count(),
            "received", repo.countByStatus("RECEIVED"),
            "assigned", repo.countByStatus("ASSIGNED"),
            "inProgress", repo.countByStatus("IN_PROGRESS"),
            "resolved", repo.countByStatus("RESOLVED"),
            "highPriority", repo.countByPriority("HIGH")
        );
    }
}