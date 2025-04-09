package com.brightminds.brightminds_backend.repository;

import com.brightminds.brightminds_backend.model.Progress;
import com.brightminds.brightminds_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByStudent(User student);
}