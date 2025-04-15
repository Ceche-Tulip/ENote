package com.enote.service;

import com.enote.dto.CategoryRequest;
import com.enote.dto.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 分类服务接口
 * 定义了分类的增删改查等基本操作
 */
public interface CategoryService {
    
    /**
     * 创建新分类
     * @param request 分类请求对象
     * @return 创建后的分类响应对象
     */
    CategoryResponse createCategory(CategoryRequest request);
    
    /**
     * 更新分类
     * @param id 分类ID
     * @param request 分类请求对象
     * @return 更新后的分类响应对象
     */
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    
    /**
     * 删除分类
     * @param id 分类ID
     */
    void deleteCategory(Long id);
    
    /**
     * 根据ID获取分类
     * @param id 分类ID
     * @return 分类响应对象
     */
    CategoryResponse getCategoryById(Long id);
    
    /**
     * 获取当前登录用户的所有分类
     * @return 分类响应对象列表
     */
    List<CategoryResponse> getAllCategories();
    
    /**
     * 分页获取当前用户的分类
     * @param pageable 分页对象
     * @return 分页的分类响应对象
     */
    Page<CategoryResponse> getCategoriesByPage(Pageable pageable);
}