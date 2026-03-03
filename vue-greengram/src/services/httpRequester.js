import axios from "axios";
import { reissue } from "@/services/userService";
import { useAuthenticationStore } from "@/stores/authentication";
import { useMessageModalStore } from "@/stores/messageModal";

axios.defaults.baseURL = `/api/`;
axios.defaults.withCredentials = true;

// 인터셉터
axios.interceptors.response.use(
  res => res,
  async err => {
    console.log("err: ", err);
    if (err.response) {
      console.log("err.response : ", err.response);
      const authenticationStore = useAuthenticationStore(); // 이하 토큰 만료시 자동 연장
      if (err.config.url === "/user/reissue" && err.response.status === 500) {
        //AT 재발급 시도했으나 에러 터졌음. >> RT 만료
        authenticationStore.signOut(); //로그아웃 처리
      } else if (
        err.response.status === 401 &&
        authenticationStore.state.isSigned
      ) {
        //로그인 상태인데 401상태로 응답을 받으면 >> AT 만료
        //401 UnAuthorized 에러인데 FE 로그인 처리 되어 있다면

        await reissue(); //AccessToken 재발행 시도

        // 중단된 요청을(에러난 요청)을 토큰 갱신 후 재요청
        return await axios.request(err.config);
      } else {
        const message = err.response.data?.resultMessage
          ? err.response.data?.resultMessage
          : err.response.data;

        const messageModalStore = useMessageModalStore();
        messageModalStore.setMessage(message);
      }
    }

    return Promise.reject(err);
  },
);

export default axios;
