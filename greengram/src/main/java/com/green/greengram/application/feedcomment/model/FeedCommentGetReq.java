package com.green.greengram.application.feedcomment.model;

import lombok.Getter;

@Getter
public class FeedCommentGetReq {
    private int page;
    private long feeId;
    private int startIdx;
    private int size;

    public FeedCommentGetReq(int page, long feeId, int size) {
        this.page = page;
        this.feeId = feeId;
        this.size = size;
        this.startIdx = (page - 1) * size;
    }
}
