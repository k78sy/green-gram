package com.green.greengram.application.userfollow;

import com.green.greengram.application.userfollow.model.UserFollowReq;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserFollowMapper {
    int follow( UserFollowReq req );
    int unfollow( UserFollowReq req );
}
