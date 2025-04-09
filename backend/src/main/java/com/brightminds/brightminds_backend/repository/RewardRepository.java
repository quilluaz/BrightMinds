package com.brightminds.brightminds_backend.repository;

import com.brightminds.brightminds_backend.model.Reward;
import com.brightminds.brightminds_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByStudent(User student);

    @Query("SELECT r.student.id, r.student.email, SUM(r.gems) as totalGems " +
           "FROM Reward r GROUP BY r.student.id, r.student.email " +
           "ORDER BY totalGems DESC LIMIT 10")
    List<Object[]> findTopStudentsByTotalGems();
}