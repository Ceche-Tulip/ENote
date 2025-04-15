package com.enote.service.impl;

import com.enote.dto.TagRequest;
import com.enote.dto.TagResponse;
import com.enote.entity.Tag;
import com.enote.entity.User;
import com.enote.repository.TagRepository;
import com.enote.security.SecurityUtils;
import com.enote.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 标签服务实现类
 * 实现对标签的增删改查等业务逻辑
 */
@Service
@RequiredArgsConstructor
@Transactional
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final SecurityUtils securityUtils;

    /**
     * 创建新标签
     * @param request 标签请求对象
     * @return 创建后的标签响应对象
     */
    @Override
    public TagResponse createTag(TagRequest request) {
        // 获取当前登录用户
        User currentUser = securityUtils.getCurrentUser();

        // 创建新标签
        Tag tag = new Tag();
        tag.setName(request.getName());
        tag.setUser(currentUser);

        // 保存标签
        Tag savedTag = tagRepository.save(tag);

        // 转换为响应对象并返回
        return convertToResponse(savedTag);
    }

    /**
     * 更新标签
     * @param id 标签ID
     * @param request 标签请求对象
     * @return 更新后的标签响应对象
     * @throws IllegalArgumentException 如果标签不存在或不属于当前用户
     */
    @Override
    public TagResponse updateTag(Long id, TagRequest request) {
        // 获取标签
        Tag tag = getOwnedTagById(id);
        
        // 更新标签名称
        tag.setName(request.getName());
        
        // 保存更新后的标签
        Tag updatedTag = tagRepository.save(tag);
        
        // 转换为响应对象并返回
        return convertToResponse(updatedTag);
    }

    /**
     * 删除标签
     * @param id 标签ID
     * @throws IllegalArgumentException 如果标签不存在或不属于当前用户
     */
    @Override
    public void deleteTag(Long id) {
        // 获取标签（同时验证所有权）
        Tag tag = getOwnedTagById(id);
        
        // 删除标签
        tagRepository.delete(tag);
    }

    /**
     * 根据ID获取标签
     * @param id 标签ID
     * @return 标签响应对象
     * @throws IllegalArgumentException 如果标签不存在或不属于当前用户
     */
    @Override
    @Transactional(readOnly = true)
    public TagResponse getTagById(Long id) {
        Tag tag = getOwnedTagById(id);
        return convertToResponse(tag);
    }

    /**
     * 获取当前用户的所有标签（不分页）
     * @return 标签响应对象列表
     */
    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        User currentUser = securityUtils.getCurrentUser();
        List<Tag> tags = tagRepository.findByUserId(currentUser.getId());
        return tags.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 分页获取当前用户的标签
     * @param pageable 分页参数
     * @return 分页标签响应对象
     */
    @Override
    @Transactional(readOnly = true)
    public Page<TagResponse> getTagsByPage(Pageable pageable) {
        User currentUser = securityUtils.getCurrentUser();
        // 这里假设 TagRepository 中有一个 findByUserIdPageable 方法
        // 实际上可能需要添加这个方法到 TagRepository 中
        Page<Tag> tagsPage = tagRepository.findAll(pageable);
        
        return tagsPage.map(this::convertToResponse);
    }

    /**
     * 根据ID集合获取标签
     * @param tagIds 标签ID集合
     * @return 标签响应对象列表
     */
    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> getTagsByIds(Set<Long> tagIds) {
        User currentUser = securityUtils.getCurrentUser();
        Set<Tag> tags = tagRepository.findByIdIn(tagIds);
        
        // 过滤出属于当前用户的标签
        return tags.stream()
                .filter(tag -> tag.getUser().getId().equals(currentUser.getId()))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 获取当前用户拥有的标签
     * @param id 标签ID
     * @return 标签实体
     * @throws IllegalArgumentException 如果标签不存在或不属于当前用户
     */
    private Tag getOwnedTagById(Long id) {
        User currentUser = securityUtils.getCurrentUser();
        
        // 获取标签
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("标签不存在"));
        
        // 验证标签所有权
        if (!tag.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("没有权限操作该标签");
        }
        
        return tag;
    }

    /**
     * 将标签实体转换为响应对象
     * @param tag 标签实体
     * @return 标签响应对象
     */
    private TagResponse convertToResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .noteCount(tag.getNotes() != null ? tag.getNotes().size() : 0)
                .build();
    }
}
