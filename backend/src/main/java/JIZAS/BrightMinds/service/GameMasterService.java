package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.UserUpdateDTO;
import JIZAS.BrightMinds.dto.UserViewDTO;
import JIZAS.BrightMinds.entity.GameAttempt;
import JIZAS.BrightMinds.entity.Story;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.repository.GameAttemptRepository;
import JIZAS.BrightMinds.repository.StoryRepository;
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
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class GameMasterService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private GameAttemptRepository gameAttemptRepository;

    @Autowired
    private StoryRepository storyRepository;

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
                student.setMustChangePassword(true); // Force password change on first login
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

    // Analytics methods for Game Master Dashboard
    public Map<String, Object> getGameMasterAnalytics(Long gameMasterId) {
        List<User> students = userRepository.findByCreatedBy_UserId(gameMasterId);
        List<Long> studentIds = students.stream()
                .map(User::getUserId)
                .collect(Collectors.toList());

        Map<String, Object> analytics = new HashMap<>();
        
        // Most played games
        analytics.put("mostPlayedGames", getMostPlayedGames(studentIds));
        
        // Student performance overview
        analytics.put("studentPerformance", getStudentPerformance(studentIds));
        
        // Recent activity
        analytics.put("recentActivity", getRecentActivity(studentIds));
        
        // Score distribution
        analytics.put("scoreDistribution", getScoreDistribution(studentIds));
        
        // Completion rates
        analytics.put("completionRates", getCompletionRates(studentIds));

        return analytics;
    }

    private List<Map<String, Object>> getMostPlayedGames(List<Long> studentIds) {
        List<GameAttempt> attempts = gameAttemptRepository.findByUserUserIdIn(studentIds);
        
        Map<Integer, Long> gameCounts = attempts.stream()
                .collect(Collectors.groupingBy(
                    attempt -> attempt.getStory().getStoryId(),
                    Collectors.counting()
                ));

        return gameCounts.entrySet().stream()
                .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> gameData = new HashMap<>();
                    Story story = storyRepository.findById(entry.getKey()).orElse(null);
                    gameData.put("storyId", entry.getKey());
                    gameData.put("storyTitle", story != null ? story.getTitle() : "Unknown Story");
                    gameData.put("playCount", entry.getValue());
                    return gameData;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getStudentPerformance(List<Long> studentIds) {
        return studentIds.stream()
                .map(studentId -> {
                    List<GameAttempt> attempts = gameAttemptRepository.findByUserUserIdOrderByEndAttemptDateDesc(studentId);
                    User student = userRepository.findById(studentId).orElse(null);
                    
                    Map<String, Object> performance = new HashMap<>();
                    performance.put("studentId", studentId);
                    performance.put("studentName", student != null ? student.getFName() + " " + student.getLName() : "Unknown");
                    performance.put("totalAttempts", attempts.size());
                    
                    if (!attempts.isEmpty()) {
                        double avgScore = attempts.stream()
                                .mapToDouble(GameAttempt::getPercentage)
                                .average()
                                .orElse(0.0);
                        performance.put("averageScore", Math.round(avgScore * 100.0) / 100.0);
                        performance.put("bestScore", attempts.stream()
                                .mapToDouble(GameAttempt::getPercentage)
                                .max()
                                .orElse(0.0));
                    } else {
                        performance.put("averageScore", 0.0);
                        performance.put("bestScore", 0.0);
                    }
                    
                    return performance;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("averageScore"), (Double) a.get("averageScore")))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getRecentActivity(List<Long> studentIds) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        
        List<GameAttempt> recentAttempts = gameAttemptRepository.findByUserUserIdInAndEndAttemptDateAfterOrderByEndAttemptDateDesc(
                studentIds, oneWeekAgo);

        return recentAttempts.stream()
                .limit(10)
                .map(attempt -> {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("studentName", attempt.getUser().getFName() + " " + attempt.getUser().getLName());
                    activity.put("storyTitle", attempt.getStory().getTitle());
                    activity.put("score", attempt.getPercentage());
                    activity.put("date", attempt.getEndAttemptDate());
                    return activity;
                })
                .collect(Collectors.toList());
    }

    private Map<String, Object> getScoreDistribution(List<Long> studentIds) {
        List<GameAttempt> attempts = gameAttemptRepository.findByUserUserIdIn(studentIds);
        
        Map<String, Object> distribution = new HashMap<>();
        distribution.put("excellent", attempts.stream().mapToDouble(GameAttempt::getPercentage).filter(score -> score >= 90).count());
        distribution.put("good", attempts.stream().mapToDouble(GameAttempt::getPercentage).filter(score -> score >= 70 && score < 90).count());
        distribution.put("average", attempts.stream().mapToDouble(GameAttempt::getPercentage).filter(score -> score >= 50 && score < 70).count());
        distribution.put("poor", attempts.stream().mapToDouble(GameAttempt::getPercentage).filter(score -> score < 50).count());
        
        return distribution;
    }

    private Map<String, Object> getCompletionRates(List<Long> studentIds) {
        List<Story> allStories = storyRepository.findAll();
        Map<String, Object> completionRates = new HashMap<>();
        
        for (Story story : allStories) {
            long totalStudents = studentIds.size();
            long completedStudents = gameAttemptRepository.countByUserUserIdInAndStoryStoryId(studentIds, story.getStoryId());
            
            Map<String, Object> storyCompletion = new HashMap<>();
            storyCompletion.put("storyTitle", story.getTitle());
            storyCompletion.put("completed", completedStudents);
            storyCompletion.put("total", totalStudents);
            storyCompletion.put("completionRate", totalStudents > 0 ? (double) completedStudents / totalStudents * 100 : 0);
            
            completionRates.put("story_" + story.getStoryId(), storyCompletion);
        }
        
        return completionRates;
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

    public void resetStudentPassword(Long gameMasterId, Long studentId) {
        User gameMaster = userRepository.findById(gameMasterId)
                .orElseThrow(() -> new RuntimeException("GameMaster not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getCreatedBy() == null || !student.getCreatedBy().getUserId().equals(gameMaster.getUserId())) {
            throw new RuntimeException("You are not authorized to reset this student's password.");
        }

        // Reset to default password and force change on next login
        student.setPassword(passwordEncoder.encode("brightmindsplayer"));
        student.setMustChangePassword(true);
        userRepository.save(student);
    }
}
