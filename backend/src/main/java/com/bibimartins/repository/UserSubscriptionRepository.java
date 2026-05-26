package com.bibimartins.repository;

import com.bibimartins.entity.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT us FROM UserSubscription us WHERE us.user.id = :userId AND us.active = true AND (us.expiresAt IS NULL OR us.expiresAt > CURRENT_TIMESTAMP)")
    List<UserSubscription> findByUserIdAndActiveTrue(@org.springframework.data.repository.query.Param("userId") Long userId);
}
