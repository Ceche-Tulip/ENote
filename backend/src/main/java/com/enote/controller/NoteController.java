package com.enote.controller;

import com.enote.dto.NoteRequest;
import com.enote.dto.NoteResponse;
import com.enote.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@RequestBody NoteRequest request) {
        return ResponseEntity.ok(noteService.createNote(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> updateNote(@PathVariable Long id, @RequestBody NoteRequest request) {
        return ResponseEntity.ok(noteService.updateNote(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> getNoteById(@PathVariable Long id) {
        return ResponseEntity.ok(noteService.getNoteById(id));
    }

    @GetMapping
    public ResponseEntity<Page<NoteResponse>> getNotes(Pageable pageable) {
        return ResponseEntity.ok(noteService.getNotes(pageable));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<NoteResponse>> getNotesByCategory(
            @PathVariable Long categoryId, Pageable pageable) {
        return ResponseEntity.ok(noteService.getNotesByCategory(categoryId, pageable));
    }

    @GetMapping("/tag/{tagId}")
    public ResponseEntity<Page<NoteResponse>> getNotesByTag(
            @PathVariable Long tagId, Pageable pageable) {
        return ResponseEntity.ok(noteService.getNotesByTag(tagId, pageable));
    }
}