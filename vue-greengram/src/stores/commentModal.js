import { reactive } from "vue";
import { defineStore } from "pinia";
import {
  postComment,
  getCommentList,
  deleteComment,
} from "@/services/feedCommentService";
import { useAuthenticationStore } from "@/stores/authentication";
import { useFeedStore } from "@/stores/feed";

import { useMessageModalStore } from '@/stores/messageModal';

import { getCurrentTimestamp } from "@/utils/commonUtils";

export const useCommentModalStore = defineStore("commentModal", () => {
  const state = reactive({
    showModal: false,
    commentList: [],
    feedId: 0,
    page: 1,
    size: 20,
    isLoading: false,
    isFinish: false,
    comment: "",
  });

  const close = () => {
    console.log("close!!!");
    state.showModal = false;
    state.isFinish = false;
    state.commentList = [];
    state.feedId = 0;
    state.page = 1;
  };

  const setFeedId = (feedId) => {
    close();
    state.showModal = true;
    state.feedId = feedId;
    // doGetCommentList();
  };

  const doPostComment = async () => {
    const authenticationStore = useAuthenticationStore();
    const messageModalStore = useMessageModalStore();

    if (state.comment.trim().length === 0) {
      // alert("댓글 내용을 작성해 주세요."); 
      messageModalStore.setMessage("댓글 내용을 작성해 주세요.")
      return;
    }

    const data = {
      feedId: state.feedId,
      comment: state.comment,
    };

    const res = await postComment(data);
    if (res.status === 200) { // 방금 새롭게 작성한 덧글에 관하여
      const result = res.data.resultData;

      const commentItem = {
        feedId:state.feedId,
        feedCommentId: result,
        writerUserId: authenticationStore.state.signedUser.userId,
        writerNickName: authenticationStore.state.signedUser.nickName,
        writerPic: authenticationStore.state.signedUser.pic,
        comment: state.comment,
        createdAt: getCurrentTimestamp,
        isSelf: true,
      };

      state.commentList.unshift(commentItem); // unshift: 방금 만든 객체를 commentList 배열의 [0]번방에 item 추가
      state.comment = "";

      // 피드 댓글 수 수정
      const feedStore = useFeedStore();
      feedStore.commentCountUp(state.feedId);
    }
  };

  const doGetCommentList = async () => {
    if (state.isLoading || state.isFinish || state.feedId === 0) {
      return;
    }
    state.isLoading = true;
    const params = {
      feed_id: state.feedId,
      page: state.page++,
      size: state.size,
    };
    const res = await getCommentList(params);
    console.log("commentList: ", res.data.resultData);
    if (res.status === 200) {
      state.commentList.push(...res.data.resultData);
      state.isFinish = res.data.resultData.length < state.size;
    }
    state.isLoading = false;
  };

  const doDeleteComment = async (item) => {
    if (!confirm("삭제하시겠습니까?")) {
      return;
    }
    const params = { feed_comment_id: item.feedCommentId };
    const res = await deleteComment(params);
    if (res.status === 200) {
      const idx = state.commentList.indexOf(item);
      state.commentList.splice(idx, 1); //splice 배열에서 아이템 삭제하는 방법

      const feedStore = useFeedStore();
      feedStore.commentCountDown(item.feedId);
    }
  };

  return {
    state,
    close,
    setFeedId,
    doPostComment,
    doGetCommentList,
    doDeleteComment,
  };
});
