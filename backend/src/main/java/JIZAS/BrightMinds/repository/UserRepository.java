package JIZAS.BrightMinds.repository;

import JIZAS.BrightMinds.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> { }
