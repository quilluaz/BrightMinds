package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.LoginRequestDTO;
import JIZAS.BrightMinds.dto.UserCreationDTO;
import JIZAS.BrightMinds.dto.UserUpdateDTO;
import JIZAS.BrightMinds.dto.UserViewDTO;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    @Value("${brightminds.teacher-secret-code}")
    private String teacherSecretCode;

    public UserService(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public UserViewDTO create(UserCreationDTO req) {
        // Check if email already exists
        if (repo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User u = new User();
        u.setFName(req.getFirstName());
        u.setLName(req.getLastName());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));

        // Teacher code is now required for all signups
        if (req.getTeacherCode().equals(teacherSecretCode)) {
            u.setRole(User.Role.GAMEMASTER); // Assign GAMEMASTER role
        } else {
            // If the code is wrong, reject the signup
            throw new RuntimeException("Invalid teacher code provided. Only teachers can create accounts.");
        }

        return toView(repo.save(u));
    }

    public UserViewDTO get(Long id) {
        return repo.findById(id).map(this::toView).orElse(null);
    }

    public List<UserViewDTO> list() {
        return repo.findAll().stream().map(this::toView).collect(Collectors.toList());
    }

    public UserViewDTO update(Long id, UserUpdateDTO req) {
        User u = repo.findById(id).orElse(null);
        if (u == null) return null;

        // Check if email is being changed and if it already exists
        if (!u.getEmail().equals(req.getEmail()) &&
                repo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        u.setFName(req.getFirstName());
        u.setLName(req.getLastName());
        u.setEmail(req.getEmail());

        // Only hash password if it's being updated (not empty)
        if (req.getPassword() != null && !req.getPassword().trim().isEmpty()) {
            u.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        return toView(repo.save(u));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public UserViewDTO getByEmail(String email) {
        return repo.findByEmail(email).map(this::toView).orElse(null);
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
