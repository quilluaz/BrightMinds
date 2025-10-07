package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // Find all users created by a specific user (GameMaster)
    List<User> findByCreatedBy_UserId(Long userId);
}