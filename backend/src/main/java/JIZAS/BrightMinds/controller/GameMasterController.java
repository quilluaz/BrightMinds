package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.UserUpdateDTO;
import JIZAS.BrightMinds.dto.UserViewDTO;
import JIZAS.BrightMinds.service.GameMasterService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gamemaster")
public class GameMasterController {

    @Autowired
    private GameMasterService gameMasterService;

    @GetMapping("/students")
    // @PreAuthorize("hasRole('GAMEMASTER')") // TODO: Re-enable when JWT is fully implemented
    public ResponseEntity<List<UserViewDTO>> getMyStudents(@RequestHeader(value = "X-GameMaster-Id", defaultValue = "1") Long gameMasterId) {
        // TODO: Get gameMasterId from JWT token when authentication is implemented
        return ResponseEntity.ok(gameMasterService.findStudentsByCreator(gameMasterId));
    }

    @PutMapping("/student/{studentId}")
    // @PreAuthorize("hasRole('GAMEMASTER')") // TODO: Re-enable when JWT is fully implemented
    public ResponseEntity<UserViewDTO> updateStudent(@PathVariable Long studentId, @Valid @RequestBody UserUpdateDTO userUpdateDTO, @RequestHeader(value = "X-GameMaster-Id", defaultValue = "1") Long gameMasterId) {
        // TODO: Get gameMasterId from JWT token when authentication is implemented
        UserViewDTO updatedStudent = gameMasterService.updateStudent(gameMasterId, studentId, userUpdateDTO);
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/student/{studentId}")
    // @PreAuthorize("hasRole('GAMEMASTER')") // TODO: Re-enable when JWT is fully implemented
    public ResponseEntity<Void> deleteStudent(@PathVariable Long studentId, @RequestHeader(value = "X-GameMaster-Id", defaultValue = "1") Long gameMasterId) {
        // TODO: Get gameMasterId from JWT token when authentication is implemented
        gameMasterService.deleteStudent(gameMasterId, studentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/students/upload")
    // @PreAuthorize("hasRole('GAMEMASTER')") // TODO: Re-enable when JWT is fully implemented
    public ResponseEntity<?> uploadStudents(@RequestParam("file") MultipartFile file, @RequestHeader(value = "X-GameMaster-Id", defaultValue = "1") Long gameMasterId) {
        // TODO: Get gameMasterId from JWT token when authentication is implemented
        try {
            gameMasterService.importStudentsFromExcel(file, gameMasterId);
            return ResponseEntity.ok(Map.of("message", "Students imported successfully."));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to process Excel file."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/students/export")
    // @PreAuthorize("hasRole('GAMEMASTER')") // TODO: Re-enable when JWT is fully implemented
    public void exportStudents(HttpServletResponse response, @RequestHeader(value = "X-GameMaster-Id", defaultValue = "1") Long gameMasterId) throws IOException {
        // TODO: Get gameMasterId from JWT token when authentication is implemented
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=students_" + currentDateTime + ".xlsx";
        response.setHeader(headerKey, headerValue);

        gameMasterService.exportStudentsToExcel(gameMasterId, response);
    }

    @GetMapping("/analytics")
    // @PreAuthorize("hasRole('GAMEMASTER')") // TODO: Re-enable when JWT is fully implemented
    public ResponseEntity<Map<String, Object>> getAnalytics(@RequestHeader(value = "X-GameMaster-Id", defaultValue = "1") Long gameMasterId) {
        // TODO: Get gameMasterId from JWT token when authentication is implemented
        Map<String, Object> analytics = gameMasterService.getGameMasterAnalytics(gameMasterId);
        return ResponseEntity.ok(analytics);
    }
}
