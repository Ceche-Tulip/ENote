package com.enote.controller;

import com.enote.dto.TagRequest;
import com.enote.dto.TagResponse;
import com.enote.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * 标签控制器
 * 提供标签管理的 REST API
 */
@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")  // 允许跨域访问
public class TagController {

    private final TagService tagService;

    /**
     * 创建新标签
     * @param request 标签请求对象
     * @return 创建后的标签响应
     */
    @PostMapping
    public ResponseEntity<TagResponse> createTag(@Valid @RequestBody TagRequest request) {
        TagResponse response = tagService.createTag(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 更新标签
     * @param id 标签ID
     * @param request 标签请求对象
     * @return 更新后的标签响应
     */
    @PutMapping("/{id}")
    public ResponseEntity<TagResponse> updateTag(
            @PathVariable Long id, 
            @Valid @RequestBody TagRequest request) {
        TagResponse response = tagService.updateTag(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 删除标签
     * @param id 标签ID
     * @return 无内容响应
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 获取单个标签
     * @param id 标签ID
     * @return 标签响应
     */
    @GetMapping("/{id}")
    public ResponseEntity<TagResponse> getTagById(@PathVariable Long id) {
        TagResponse response = tagService.getTagById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 获取当前用户的所有标签（不分页）
     * @return 标签响应列表
     */
    @GetMapping("/all")
    public ResponseEntity<List<TagResponse>> getAllTags() {
        List<TagResponse> responses = tagService.getAllTags();
        return ResponseEntity.ok(responses);
    }

    /**
     * 分页获取当前用户的标签
     * @param pageable 分页参数
     * @return 分页标签响应
     */
    @GetMapping
    public ResponseEntity<Page<TagResponse>> getTagsByPage(Pageable pageable) {
        Page<TagResponse> responses = tagService.getTagsByPage(pageable);
        return ResponseEntity.ok(responses);
    }
    
    /**
     * 根据ID集合获取标签
     * @param tagIds 标签ID集合
     * @return 标签响应列表
     */
    @GetMapping("/byIds")
    public ResponseEntity<List<TagResponse>> getTagsByIds(@RequestParam Set<Long> tagIds) {
        List<TagResponse> responses = tagService.getTagsByIds(tagIds);
        return ResponseEntity.ok(responses);
    }
}