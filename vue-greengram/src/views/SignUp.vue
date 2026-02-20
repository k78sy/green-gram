<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { signUp } from '@/services/userService';
import { checkValidation } from '@/utils/validation';

const fileInput = ref(null);
const imageUrl = ref(null);

const router = useRouter();

const state = reactive({
    data: {
        nm: '홍길동',
        uid: 'mic1',
        upw: 'aaaa1212!!'              
    },
    chkUpw: 'aaaa1212!!',
    pic: null
});

const openFileSelector = e => {
    fileInput.value.click();
};

const handlePicChanged = e => {
    imageUrl.value = null;
    state.pic = e.target.files[0];
    if (state.pic) {
        const reader = new FileReader();
        reader.onload = (e) => {
        imageUrl.value = e.target.result; // Data URL로 변환하여 저장
        };
        reader.readAsDataURL(state.pic);
    }
};

const submit = async () => {
    //유효성 체크
    if (checkValidation()) { return; }

    //비밀번호, 확인 비밀번호 체크
    if (state.chkUpw !== state.data.upw) {
        alert( '비밀번호와 확인 비밀번호가 일치하지 않습니다.' );
        return;
    }


    const formData = new FormData();
    formData.append( 'req', new Blob([JSON.stringify(state.data)], { type: 'application/json' }) );
    if (state.pic) {
        formData.append( 'pic', state.pic );
    }

    const res = await signUp(formData);
    console.log('res:', res);
    if (res) {
        alert('회원가입을 축하합니다.');
        await router.push('/sign-in');
    }
};
</script>

<template>
    <div class="join">
        <div class="container">
        <form class="py-5 d-flex flex-column gap-3" @submit.prevent="submit">
            <h1 class="h5 mb-3">회원가입</h1>

            <div class="form-floating">
            <input
                type="text"
                class="form-control valid"
                id="uid"
                placeholder="아이디"
                v-model="state.data.uid"
                not-null-message="아이디는 필수로 입력하셔야 합니다."
                regexp="^[A-Za-z0-9_]{4,50}$"
                regexp-message="아이디는 영어, 숫자, 언더바로만 구성되어야 하며 4~50자까지 작성할 수 있습니다." />
            <label for="uid" class="form-label">아이디</label>
            </div>

            <div class="form-floating">
            
            <input
                type="password"
                class="form-control valid"
                id="upw"
                placeholder="비밀번호"
                v-model="state.data.upw"
                not-null-message="비밀번호는 필수로 입력하셔야 합니다."
                regexp="^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&amp;*()_+\-=\[\]{};':&quot;\\|,.&lt;&gt;\/?])[A-Za-z\d!@#$%^&amp;*()_+\-=\[\]{};':&quot;\\|,.&lt;&gt;\/?]{10,}$"
                regexp-message="비밀번호는 영문자, 숫자, 특수기호로 구성되며 10자 이상이어야 합니다."
                autocomplete="off" />
            <label for="upw" class="form-label">비밀번호</label>
            </div>
            <div class="form-floating">
            <input
                type="password"
                class="form-control"
                id="chkUpw"
                placeholder="비밀번호 확인"
                v-model="state.chkUpw"
                autocomplete="off" />
            <label for="chkUpw" class="form-label">비밀번호 확인</label>
            </div>
            <div class="form-floating">
            <input
                type="text"
                class="form-control valid"
                id="nickName"
                placeholder="닉네임"
                v-model="state.data.nm"
                not-null-message="닉네임은 필수로 입력하셔야 합니다."
                regexp="^[가-힣]{2,10}$"
                regexp-message="닉네임은 한글로 2~10자까지 가능합니다." />
            <label for="nickName" class="form-label">닉네임</label>
            </div>
            <div>
            <b-button variant="outline-primary" @click="openFileSelector">프로필 사진</b-button>
            <input
                ref="fileInput"
                hidden
                id="pic"
                type="file"
                accept="image/*"
                @change="handlePicChanged" />
            <span class="ms-3" v-if="state.pic">{{ state.pic.name }}</span>
            </div>
            <div v-if="imageUrl">
                <img :src="imageUrl" alt="Selected" style="max-width: 300px; margin-top: 10px;" />
            </div>
            <button class="w-100 h6 btn py-3 btn-primary">회원가입</button>
        </form>
    </div>
</div>
</template>

<style scoped>
.container { max-width: 576px; }
</style>