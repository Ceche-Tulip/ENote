package com.enote.controller;

import com.enote.dto.CategoryRequest;
import com.enote.dto.CategoryResponse;
import com.enote.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类控制器
 * 提供分类管理的 REST API
 */
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")  // 允许跨域访问
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * 创建新分类
     * @param request 分类请求对象
     * @return 创建后的分类响应
     */
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 更新分类
     * @param id 分类ID
     * @param request 分类请求对象
     * @return 更新后的分类响应
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id, 
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 删除分类
     * @param id 分类ID
     * @return 无内容响应
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 获取单个分类
     * @param id 分类ID
     * @return 分类响应
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        CategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 获取当前用户的所有分类（不分页）
     * @return 分类响应列表
     */
    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> responses = categoryService.getAllCategories();
        return ResponseEntity.ok(responses);
    }

    /**
     * 分页获取当前用户的分类
     * @param pageable 分页参数
     * @return 分页分类响应
     */
    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> getCategoriesByPage(Pageable pageable) {
        Page<CategoryResponse> responses = categoryService.getCategoriesByPage(pageable);
        return ResponseEntity.ok(responses);
    }
}