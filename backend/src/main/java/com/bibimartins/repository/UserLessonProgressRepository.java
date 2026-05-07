package com.bibimartins.repository;

import com.bibimartins.entity.UserLessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {
    List<UserLessonProgress> findByUserId(Long userId);
    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
}
