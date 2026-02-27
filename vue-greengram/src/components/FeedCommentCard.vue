<script setup>
import ProfileImg from './ProfileImg.vue';
import { useAuthenticationStore } from '@/stores/authentication';

const authenticationStore = useAuthenticationStore();

const props = defineProps({
  item: Object
});

const emit = defineEmits(['onDeleteComment']);
const deleteComment = () => {
  emit('onDeleteComment');
};
</script>

<template>

  <div class="comment-card-wrapper">
    <div class="cmtItemCont mt-3 d-flex flex-row">
      <div class="cmtItemProfile">
        <router-link :to="`/profile/${props.item.writerUserId}`">
          <profile-img :clsValue="'profile pointer'" :size="24" :pic="props.item.writerPic"
            :userId="props.item.writerUserId" />
        </router-link>
      </div>
      <router-link :to="`/profile/${props.item.writerUserId}`">
        <div class="cmtItemCtnt ms-2">
          <div class="pointer">
            {{
              props.item.writerNickName
                ? props.item.writerNickName
                : props.item.writerUid
            }}
          </div>
        </div>
      </router-link>
      <div v-if="authenticationStore.state.signedUser.userId === props.item.writerUserId" class="ms-3">
        <font-awesome-icon icon="fa fa-trash" class="pointer" @click="deleteComment" />
      </div>
      <div>{{ props.item.comment }}</div>
    </div>
  </div>
</template>

<style scoped></style>