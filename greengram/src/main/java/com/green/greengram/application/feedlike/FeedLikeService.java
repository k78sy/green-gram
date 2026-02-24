package com.green.greengram.application.feedlike;

import com.green.greengram.application.feedlike.model.FeedLikeReq;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedLikeService {
    private final FeedLikeMapper feedLikeMapper;

    // 좋아요 처리 true
    // 좋아요 취소 false

    // 1경우. select. row가 있다? delete 처리하고 return false
    // 2경우. select. row가 없다? insert 처리하고 return true
    public boolean toggleFeedLike(FeedLikeReq req){
        // delete를 하고
        int delAffectedRows = feedLikeMapper.delete(req);

        // if = 1이라면 return false
        if(delAffectedRows == 1){
            return false;
        }
        // if = 0이라면 insert 하고 return true
        feedLikeMapper.save(req);
        return true;
    }
}
