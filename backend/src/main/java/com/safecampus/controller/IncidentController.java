package com.safecampus.controller;
import com.safecampus.entity.Incident; import com.safecampus.service.IncidentService; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/incidents")
public class IncidentController {
 private final IncidentService service; public IncidentController(IncidentService s){service=s;}
 @GetMapping public List<Incident> all(){return service.all();}
 @PostMapping public Incident create(@RequestBody Incident i,@RequestParam(required=false) Long reporterId){return service.create(i,reporterId);}
 @PutMapping("/{id}/status") public Incident status(@PathVariable Long id,@RequestParam String value){return service.status(id,value);}
 @PutMapping("/{id}/assign") public Incident assign(@PathVariable Long id,@RequestParam String team){return service.assign(id,team);}
 @GetMapping("/stats") public Map<String,Object> stats(){return service.stats();}
}
