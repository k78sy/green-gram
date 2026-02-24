package com.green.greengram.application.feedlike;

import com.green.greengram.application.feedlike.model.FeedLikeReq;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FeedLikeMapper {
    int deleteFeedLike(FeedLikeReq req);
    int insertFeedLike(FeedLikeReq req);
}
