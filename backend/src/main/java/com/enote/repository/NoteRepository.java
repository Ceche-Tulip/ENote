package com.enote.repository;

import com.enote.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Page<Note> findByUserId(Long userId, Pageable pageable);
    Page<Note> findByCategoryId(Long categoryId, Pageable pageable);
    
    @Query("SELECT n FROM Note n JOIN n.tags t WHERE t.id = :tagId")
    Page<Note> findByTagId(@Param("tagId") Long tagId, Pageable pageable);
    
    @Query("SELECT n FROM Note n WHERE n.user.id = :userId AND n.isDeleted = false")
    Page<Note> findActiveNotesByUserId(@Param("userId") Long userId, Pageable pageable);
}