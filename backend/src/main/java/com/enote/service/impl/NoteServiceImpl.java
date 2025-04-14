package com.enote.service.impl;

import com.enote.dto.NoteRequest;
import com.enote.dto.NoteResponse;
import com.enote.entity.Category;
import com.enote.entity.Note;
import com.enote.entity.Tag;
import com.enote.entity.User;
import com.enote.repository.CategoryRepository;
import com.enote.repository.NoteRepository;
import com.enote.repository.TagRepository;
import com.enote.repository.UserRepository;
import com.enote.service.NoteService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    @Override
    public NoteResponse createNote(NoteRequest request) {
        User currentUser = getCurrentUser();
        Note note = new Note();
        updateNoteFromRequest(note, request);
        note.setUser(currentUser);
        note = noteRepository.save(note);
        return convertToResponse(note);
    }

    @Override
    public NoteResponse updateNote(Long id, NoteRequest request) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Note not found"));
        validateNoteOwnership(note);
        updateNoteFromRequest(note, request);
        note = noteRepository.save(note);
        return convertToResponse(note);
    }

    @Override
    public void deleteNote(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Note not found"));
        validateNoteOwnership(note);
        note.setIsDeleted(true);
        noteRepository.save(note);
    }

    @Override
    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Note not found"));
        validateNoteOwnership(note);
        return convertToResponse(note);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoteResponse> getNotes(Pageable pageable) {
        User currentUser = getCurrentUser();
        return noteRepository.findActiveNotesByUserId(currentUser.getId(), pageable)
                .map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoteResponse> getNotesByCategory(Long categoryId, Pageable pageable) {
        validateCategoryOwnership(categoryId);
        return noteRepository.findByCategoryId(categoryId, pageable)
                .map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoteResponse> getNotesByTag(Long tagId, Pageable pageable) {
        validateTagOwnership(tagId);
        return noteRepository.findByTagId(tagId, pageable)
                .map(this::convertToResponse);
    }

    private void updateNoteFromRequest(Note note, NoteRequest request) {
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            validateCategoryOwnership(category);
            note.setCategory(category);
        }

        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : request.getTagIds()) {
                Tag tag = tagRepository.findById(tagId)
                        .orElseThrow(() -> new EntityNotFoundException("Tag not found"));
                validateTagOwnership(tag);
                tags.add(tag);
            }
            note.setTags(tags);
        }
    }

    private NoteResponse convertToResponse(Note note) {
        return NoteResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .category(note.getCategory() != null ? 
                    new NoteResponse.CategoryDTO(note.getCategory().getId(), note.getCategory().getName()) : null)
                .tags(note.getTags().stream()
                        .map(tag -> new NoteResponse.TagDTO(tag.getId(), tag.getName()))
                        .collect(Collectors.toSet()))
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .createdBy(note.getUser().getUsername())
                .build();
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private void validateNoteOwnership(Note note) {
        User currentUser = getCurrentUser();
        if (!note.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You don't have permission to access this note");
        }
    }

    private void validateCategoryOwnership(Category category) {
        User currentUser = getCurrentUser();
        if (!category.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You don't have permission to access this category");
        }
    }

    private void validateCategoryOwnership(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        validateCategoryOwnership(category);
    }

    private void validateTagOwnership(Tag tag) {
        User currentUser = getCurrentUser();
        if (!tag.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You don't have permission to access this tag");
        }
    }

    private void validateTagOwnership(Long tagId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found"));
        validateTagOwnership(tag);
    }
}