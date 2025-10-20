package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.UserUpdateDTO;
import JIZAS.BrightMinds.dto.UserViewDTO;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GameMasterService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserViewDTO> findStudentsByCreator(Long gameMasterId) {
        return userRepository.findByCreatedBy_UserId(gameMasterId).stream()
                .map(this::toView)
                .collect(Collectors.toList());
    }

    public UserViewDTO updateStudent(Long gameMasterId, Long studentId, UserUpdateDTO updateData) {
        User gameMaster = userRepository.findById(gameMasterId)
                .orElseThrow(() -> new RuntimeException("GameMaster not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getCreatedBy() == null || !student.getCreatedBy().getUserId().equals(gameMaster.getUserId())) {
            throw new RuntimeException("You are not authorized to modify this student.");
        }

        student.setFName(updateData.getFirstName());
        student.setLName(updateData.getLastName());
        student.setEmail(updateData.getEmail());

        if (updateData.getPassword() != null && !updateData.getPassword().isBlank()) {
            student.setPassword(passwordEncoder.encode(updateData.getPassword()));
        }

        User updatedStudent = userRepository.save(student);
        return toView(updatedStudent);
    }

    public void deleteStudent(Long gameMasterId, Long studentId) {
        User gameMaster = userRepository.findById(gameMasterId)
                .orElseThrow(() -> new RuntimeException("GameMaster not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getCreatedBy() == null || !student.getCreatedBy().getUserId().equals(gameMaster.getUserId())) {
            throw new RuntimeException("You are not authorized to delete this student.");
        }

        userRepository.delete(student);
    }

    public void importStudentsFromExcel(MultipartFile file, Long gameMasterId) throws IOException {
        User gameMaster = userRepository.findById(gameMasterId)
                .orElseThrow(() -> new RuntimeException("GameMaster not found"));

        List<User> studentsToCreate = new ArrayList<>();

        try (XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream())) {
            XSSFSheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            DataFormatter formatter = new DataFormatter();

            // Skip header row
            if (rowIterator.hasNext()) {
                rowIterator.next();
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                User student = new User();
                String email = formatter.formatCellValue(row.getCell(0)).trim();
                String firstName = formatter.formatCellValue(row.getCell(1)).trim();
                String lastName = formatter.formatCellValue(row.getCell(2)).trim();

                if (firstName.isEmpty() && lastName.isEmpty() && email.isEmpty()) {
                    continue; // skip empty rows
                }

                student.setFName(firstName);
                student.setLName(lastName);
                student.setEmail(email);
                student.setPassword(passwordEncoder.encode("brightmindsplayer"));
                student.setRole(User.Role.PLAYER);
                student.setCreatedBy(gameMaster);
                studentsToCreate.add(student);
            }
        }

        userRepository.saveAll(studentsToCreate);
    }

    public void exportStudentsToExcel(Long gameMasterId, HttpServletResponse response) throws IOException {
        List<User> students = userRepository.findByCreatedBy_UserId(gameMasterId);
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Students");

            // Header Row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Email", "First Name", "Last Name"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Data Rows
            int rowNum = 1;
            for (User student : students) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(student.getEmail());
                row.createCell(1).setCellValue(student.getFName());
                row.createCell(2).setCellValue(student.getLName());
            }

            workbook.write(response.getOutputStream());
        }
    }


    private UserViewDTO toView(User u) {
        UserViewDTO v = new UserViewDTO();
        v.setUserId(u.getUserId());
        v.setFName(u.getFName());
        v.setLName(u.getLName());
        v.setEmail(u.getEmail());
        v.setRole(u.getRole().name());
        return v;
    }
}
