package com.enote.service;

import com.enote.dto.TagRequest;
import com.enote.dto.TagResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

/**
 * 标签服务接口
 * 定义标签相关的业务逻辑操作
 */
public interface TagService {

    /**
     * 创建新标签
     * 
     * @param request 标签请求对象，包含标签名称
     * @return 创建后的标签响应对象
     */
    TagResponse createTag(TagRequest request);

    /**
     * 更新标签
     * 
     * @param id 标签ID
     * @param request 标签请求对象，包含更新后的标签名称
     * @return 更新后的标签响应对象
     */
    TagResponse updateTag(Long id, TagRequest request);

    /**
     * 删除标签
     * 
     * @param id 标签ID
     */
    void deleteTag(Long id);

    /**
     * 根据ID获取标签
     * 
     * @param id 标签ID
     * @return 标签响应对象
     */
    TagResponse getTagById(Long id);

    /**
     * 获取当前用户的所有标签（不分页）
     * 
     * @return 标签响应对象列表
     */
    List<TagResponse> getAllTags();

    /**
     * 分页获取当前用户的标签
     * 
     * @param pageable 分页参数
     * @return 分页标签响应对象
     */
    Page<TagResponse> getTagsByPage(Pageable pageable);
    
    /**
     * 根据ID集合获取标签
     * 
     * @param tagIds 标签ID集合
     * @return 标签响应对象列表
     */
    List<TagResponse> getTagsByIds(Set<Long> tagIds);
}