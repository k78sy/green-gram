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
    private int isLike; //X
    private int likeCount; //X
    private List<String> pics = new ArrayList<>();
}
