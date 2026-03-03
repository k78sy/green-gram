<script setup>
import HeaderComponent from './components/HeaderComponent.vue';
import loadingImg from '@/assets/loading.gif';
import { ref, reactive, watch, nextTick } from 'vue';
import { useMessageModalStore } from './stores/messageModal';
import { useAuthenticationStore } from './stores/authentication';
import { useFeedStore } from './stores/feed';
import { postFeed } from './services/feedService';
import { useCommentModalStore } from './stores/commentModal';
import FeedCommentCard from './components/FeedCommentCard.vue';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';

const modalCloseButton = ref(null);
const commentListContainer = ref(null);
const messageModalStore = useMessageModalStore();
const authenticationStore = useAuthenticationStore();
const feedStore = useFeedStore();
const commentModalStore = useCommentModalStore();

useInfiniteScroll(commentListContainer, () => {
    commentModalStore.doGetCommentList();
});

const state = reactive({
    feed: {
        location: '',
        contents: '',
        pics: []
    },
    previewPics: []
});

const handlePicChanged = e => {
    for (let i = 0; i < e.target.files.length; i++) {
        const pic = e.target.files[i];
        state.feed.pics.push(pic);
        state.previewPics.push(URL.createObjectURL(pic));
    }
}

const deletePreviewPic = idx => {
    state.feed.pics.splice(idx, 1);
    state.previewPics.splice(idx, 1);
}

const saveFeed = async () => {
    console.log('state.feed.pics: ', state.feed.pics);
    const MAX_PIC_COUNT = 10;
    //사진 있는지 확인    
    if (state.feed.pics.length === 0) {
        alert('사진을 선택해 주세요.');
        return;
    } else if (state.feed.pics.length > MAX_PIC_COUNT) {
        alert(`사진은 ${MAX_PIC_COUNT}장까지 선택 가능합니다.`);
        return;
    }

    const params = {
        contents: state.feed.contents.length === 0 ? null : state.feed.contents,
        location: state.feed.location.length === 0 ? null : state.feed.location
    }

    const formData = new FormData();
    formData.append('req', new Blob([JSON.stringify(params)], { type: 'application/json' }));
    for (let i = 0; i < state.feed.pics.length; i++) {
        formData.append('pic', state.feed.pics[i])
    }

    const res = await postFeed(formData);
    if (res.status === 200) {
        const result = res.data.resultData;

        const item = {
            ...params,
            feedId: result.feedId,
            pics: result.pics,
            writerUserId: authenticationStore.state.signedUser.userId,
            writerNickName: authenticationStore.state.signedUser.nickName,
            writerPic: authenticationStore.state.signedUser.pic,
            createdAt: getCurrentTimestamp(),
            isLike: 0,
            likeCount: 0,
            comments: {
                moreComment: false,
                commentList: []
            }
        };

        console.log('item: ', item);

        feedStore.addFeedUnshift(item);
        initInputs();
        modalCloseButton.value.click(); //모달창 닫기
    }
}

const initInputs = () => {
    state.feed.contents = '';
    state.feed.location = '';
    state.feed.pics = [];
    state.previewPics = [];
}

const getCurrentTimestamp = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const seconds = ('0' + today.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//메인 스크롤 방지 > 풀기 toggle
watch(() => commentModalStore.state.showModal, (isShown) => {
    document.body.classList.toggle('no-scroll', isShown);
});

const { check: checkInfiniteScroll } = useInfiniteScroll(commentListContainer, () => {
    commentModalStore.doGetCommentList();
});

// 댓글에서 스크롤이 내려간 상태에서 댓글을 쓰면 댓글 스크롤이 상단으로 이동
watch(() => commentModalStore.state.commentList, async (newList) => {
    // newList의 첫번째 항목이 방금 사용자가 작성한 댓글인지 확인 (isSelf 속성으로 확인)
    if (newList.length > 0 && newList[0].isSelf) {
        // Vue가 DOM을 새 댓글을 포함해 다시 그릴 때까지 기다림
        await nextTick(); //DOM의 변화를 vue가 인지하게 하도록 사용

        if (commentListContainer.value) {
            commentListContainer.value.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        // isSelf 플래그는 일회성으로만 사용하는 것이 좋으므로, 확인 후 제거하거나 false로 변경
        // 여기서는 unshift로 추가된 새 댓글이므로, 다음 DOM 업데이트 사이클에서 isSelf를 false로 바꿔 오동작을 방지
        await nextTick();
        newList[0].isSelf = false;
    }
    // 댓글 리스트 변경 후 (삭제 포함) 스크롤 상태를 다시 확인
    await nextTick();
    checkInfiniteScroll(); //댓글 삭제하면 다음 페이지 호출
}, { deep: true }); //deep: true는 리스트 item의 값 변경까지도 watch하겠다는 의미
</script>

<template>
    <header-component />
    <router-view />

    <b-modal v-model="messageModalStore.state.isShow" ok-only>{{ messageModalStore.state.message }}</b-modal>

    <b-modal v-model="commentModalStore.state.showModal" size="lg" no-close-on-backdrop hide-footer
        modal-class="my-custom-modal" @close="commentModalStore.close">
        <div class="p-3 h100p d-flex flex-column comment-container">
            <div ref="commentListContainer" class="comment-list overflow-y-auto">
                <feed-comment-card v-for="(item, idx) in commentModalStore.state.commentList" :key="item.feedCommentId"
                    :item="item"
                    @on-delete-comment="commentModalStore.doDeleteComment(item.feedCommentId, idx, item.feedId)" />
                <div v-if="commentModalStore.state.isLoading" class="loading display-none">
                    <img :src="loadingImg" />
                </div>
            </div>
            <div class="p-2 d-flex flex-row comment-input">
                <input type="text" name="commentValue" class="flex-grow-1 my_input back_color"
                    placeholder="댓글을 입력하세요..." v-model="commentModalStore.state.comment"
                    @keyup.enter="commentModalStore.doPostComment" />

                <button class="btn btn-outline-primary" @click="commentModalStore.doPostComment">
                    등록
                </button>

            </div>
        </div>

    </b-modal>

    <div class="modal fade" id="newFeedModal" tabIndex="-1" aria-labelledby="newFeedModalLabel" aria-hidden="false">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content" id="newFeedModalContent">
                <div class="modal-header">
                    <h5 class="modal-title" id="newFeedModalLabel">새 게시물 만들기</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        ref="modalCloseButton"></button>
                </div>
                <div class="modal-body" id="id-modal-body">
                    <div class="mt-3">location: <input type="text" name="location" placeholder="위치"
                            v-model="state.feed.location" /></div>
                    <div class="mt-3">contents: <textarea name="contents" placeholder="내용"
                            v-model="state.feed.contents"></textarea></div>
                    <div class="mt-3"><label>pic: <input name="pics" type="file" multiple accept="image/*"
                                @change="handlePicChanged" /></label></div>
                    <div class="d-flex flex-wrap gap-3 mt-3">
                        <div class="preview-container" v-for="(item, idx) in state.previewPics" :key="idx">
                            <img class="preview-img" :src="item"></img>
                            <font-awesome-icon icon="fa fa-trash" class="pointer preview-img-delete"
                                @click="deletePreviewPic(idx)" />
                        </div>
                    </div>
                    <div class="mt-3"><button @click="saveFeed">전송</button></div>
                </div>
            </div>
        </div>
    </div>


</template>

<style>
.comment-list {
    flex-grow: 1;
}

.comment-input {
    height: 50px;
}

.my-custom-modal .modal-dialog {
    display: flex;
    /* 화면에 고정 */
    justify-content: center;
    align-items: flex-end;

    /* 가로 너비 유지 (size="lg"에 맞게 조절 가능) */
    width: 90%;
    max-width: 700px;
    /* lg 사이즈 권장 최대 너비 */
}

.my-custom-modal .modal-body {
    height: 80vh;
}
</style>