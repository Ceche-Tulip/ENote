package com.enote.repository;

import com.enote.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * 分类存储库接口
 * 提供分类实体的数据访问操作
 */
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * 查找指定用户的所有分类
     * @param userId 用户ID
     * @return 分类列表
     */
    List<Category> findByUserId(Long userId);
    
    /**
     * 分页查询指定用户的分类
     * @param userId 用户ID
     * @param pageable 分页参数
     * @return 分页的分类列表
     */
    @Query("SELECT c FROM Category c WHERE c.user.id = :userId")
    Page<Category> findByUserId(@Param("userId") Long userId, Pageable pageable);
}