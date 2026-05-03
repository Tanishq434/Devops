package com.example.patientid.controller;

import com.example.patientid.model.Patient;
import com.example.patientid.model.Record;
import com.example.patientid.repository.PatientRepository;
import com.example.patientid.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private RecordRepository recordRepository;

    // 🔐 Simulating req.user._id (replace with actual auth later)
    private String getUserId() {
        return "USER_ID_PLACEHOLDER";
    }

    // ✅ GET /api/patient/profile
    @GetMapping("/profile")
    public Object getPatientProfile() {
        try {
            Optional<Patient> patientOpt = patientRepository.findById(getUserId());

            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();
                patient.setPassword(null); // hide password
                return patient;
            } else {
                return Map.of("message", "Patient not found");
            }

        } catch (Exception e) {
            return Map.of("message", e.getMessage());
        }
    }

    // ✅ PUT /api/patient/profile
    @PutMapping("/profile")
    public Object updatePatientProfile(@RequestBody Map<String, Object> body) {
        try {
            Optional<Patient> patientOpt = patientRepository.findById(getUserId());

            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();

                patient.setName((String) body.getOrDefault("name", patient.getName()));
                patient.setEmergencyContact((String) body.getOrDefault("emergencyContact", patient.getEmergencyContact()));
                patient.setBloodGroup((String) body.getOrDefault("bloodGroup", patient.getBloodGroup()));
                patient.setAllergies((String) body.getOrDefault("allergies", patient.getAllergies()));
                patient.setMedicalConditions((String) body.getOrDefault("medicalConditions", patient.getMedicalConditions()));

                if (body.get("password") != null) {
                    patient.setPassword((String) body.get("password"));
                }

                Patient updated = patientRepository.save(patient);

                return Map.of(
                        "_id", updated.getId(),
                        "name", updated.getName(),
                        "email", updated.getEmail(),
                        "emergencyContact", updated.getEmergencyContact(),
                        "bloodGroup", updated.getBloodGroup(),
                        "allergies", updated.getAllergies(),
                        "medicalConditions", updated.getMedicalConditions()
                );

            } else {
                return Map.of("message", "Patient not found");
            }

        } catch (Exception e) {
            return Map.of("message", e.getMessage());
        }
    }

    // ✅ GET /api/patient/records
    @GetMapping("/records")
    public Object getPatientRecords() {
        try {
            List<Record> records = recordRepository.findByPatientId(getUserId());
            return records;
        } catch (Exception e) {
            return Map.of("message", e.getMessage());
        }
    }

    // ✅ POST /api/patient/records
    @PostMapping("/records")
    public Object addPatientRecord(@RequestBody Map<String, String> body) {
        try {
            String title = body.get("title");
            String description = body.get("description");
            String fileUrl = body.get("fileUrl");

            if (title == null || fileUrl == null) {
                return Map.of("message", "Title and fileUrl are required");
            }

            Record record = new Record();
            record.setPatientId(getUserId());
            record.setTitle(title);
            record.setDescription(description);
            record.setFileUrl(fileUrl);

            Record created = recordRepository.save(record);
            return created;

        } catch (Exception e) {
            return Map.of("message", e.getMessage());
        }
    }

    // ✅ POST /api/patient/generate-otp
    @PostMapping("/generate-otp")
    public Object generateOtp() {
        try {
            Optional<Patient> patientOpt = patientRepository.findById(getUserId());

            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();

                String otp = String.valueOf(new Random().nextInt(900000) + 100000);
                Date expires = new Date(System.currentTimeMillis() + 60 * 60 * 1000);

                patient.setAccessOtp(otp);
                patient.setAccessOtpExpires(expires);

                patientRepository.save(patient);

                return Map.of("otp", otp, "expires", expires);

            } else {
                return Map.of("message", "Patient not found");
            }

        } catch (Exception e) {
            return Map.of("message", e.getMessage());
        }
    }
}