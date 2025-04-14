package com.enote.repository;

import com.enote.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserId(Long userId);
    Set<Tag> findByIdIn(Set<Long> tagIds);
}