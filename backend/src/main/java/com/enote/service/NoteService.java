package com.enote.service;

import com.enote.dto.NoteRequest;
import com.enote.dto.NoteResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NoteService {
    NoteResponse createNote(NoteRequest request);
    NoteResponse updateNote(Long id, NoteRequest request);
    void deleteNote(Long id);
    NoteResponse getNoteById(Long id);
    Page<NoteResponse> getNotes(Pageable pageable);
    Page<NoteResponse> getNotesByCategory(Long categoryId, Pageable pageable);
    Page<NoteResponse> getNotesByTag(Long tagId, Pageable pageable);
}