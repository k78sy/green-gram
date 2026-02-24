package com.green.greengram.application.feed.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class FeedGetRes {
    @JsonProperty("feedId") // json으로 날릴때 key값이 feedId로 변경
    private long id;
    private String contents;
    private String location;
    private String createdAt;
    private long writerUserId;
    private String writerUid;
    private String writerNickName;
    private String writerPic;
    private int isLike; // 내가 이 feed에 좋아요를 했나? 했으면 1 아니면 0
    private int likeCount; // 해당 피드에 좋아요한 수
    private List<String> pics = new ArrayList<>();
}
