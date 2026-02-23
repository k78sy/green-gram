package com.green.greengram.application.user.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserProfileGetReq {
    private long profileUserId; //프로파일 사용자 userId
    private long signUserId; //로그인한 사용자 userId
}
