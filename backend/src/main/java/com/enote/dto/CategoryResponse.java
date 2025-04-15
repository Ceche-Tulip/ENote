package com.enote.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 分类响应数据传输对象
 * 用于将分类数据返回给前端
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private String createdBy; // 创建者用户名
}