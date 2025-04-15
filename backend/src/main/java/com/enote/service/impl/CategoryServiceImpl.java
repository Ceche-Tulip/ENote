package com.enote.service.impl;

import com.enote.dto.CategoryRequest;
import com.enote.dto.CategoryResponse;
import com.enote.entity.Category;
import com.enote.entity.User;
import com.enote.repository.CategoryRepository;
import com.enote.repository.UserRepository;
import com.enote.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 分类服务实现类
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    /**
     * 创建新分类
     * @param request 分类请求对象
     * @return 创建后的分类响应对象
     */
    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        // 获取当前登录用户
        User currentUser = getCurrentUser();
        
        // 创建新分类
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setUser(currentUser);
        
        // 保存分类并转换为响应对象
        category = categoryRepository.save(category);
        return convertToResponse(category);
    }

    /**
     * 更新分类
     * @param id 分类ID
     * @param request 分类请求对象
     * @return 更新后的分类响应对象
     */
    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        // 查找分类并验证所有权
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("分类未找到"));
        validateCategoryOwnership(category);
        
        // 更新分类信息
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        // 保存并返回更新后的分类
        category = categoryRepository.save(category);
        return convertToResponse(category);
    }

    /**
     * 删除分类
     * @param id 分类ID
     */
    @Override
    public void deleteCategory(Long id) {
        // 查找分类并验证所有权
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("分类未找到"));
        validateCategoryOwnership(category);
        
        // 删除分类
        categoryRepository.delete(category);
    }

    /**
     * 根据ID获取分类
     * @param id 分类ID
     * @return 分类响应对象
     */
    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        // 查找分类并验证所有权
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("分类未找到"));
        validateCategoryOwnership(category);
        
        // 返回分类响应对象
        return convertToResponse(category);
    }

    /**
     * 获取当前登录用户的所有分类
     * @return 分类响应对象列表
     */
    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        // 获取当前用户
        User currentUser = getCurrentUser();
        
        // 查询该用户的所有分类并转换为响应对象列表
        return categoryRepository.findByUserId(currentUser.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 分页获取当前用户的分类
     * @param pageable 分页对象
     * @return 分页的分类响应对象
     */
    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> getCategoriesByPage(Pageable pageable) {
        // 获取当前用户
        User currentUser = getCurrentUser();
        
        // 使用新增的分页查询方法
        return categoryRepository.findByUserId(currentUser.getId(), pageable)
                .map(this::convertToResponse);
    }

    /**
     * 将分类实体转换为分类响应对象
     * @param category 分类实体
     * @return 分类响应对象
     */
    private CategoryResponse convertToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .createdBy(category.getUser().getUsername())
                .build();
    }

    /**
     * 获取当前登录用户
     * @return 用户实体
     */
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("用户未找到"));
    }

    /**
     * 验证分类所有权
     * @param category 分类实体
     */
    private void validateCategoryOwnership(Category category) {
        User currentUser = getCurrentUser();
        if (!category.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("您没有权限访问此分类");
        }
    }
}