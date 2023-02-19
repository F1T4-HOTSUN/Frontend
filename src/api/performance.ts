import { ICheckReservationData } from "../types/performance";
import client from "./client";

const PerformanceAPI = {
  getPerformanceById: (prfId: string|undefined) => {
    return client.get(`/performance?p=${prfId}`);
  },
  getPerformanceByKeyword: (keyword: string | undefined) => {
    return client.get(`/performance/search?keyword=${keyword}`);
  },
  getPerformanceByCategory: (genre: string | undefined) => {
    return client.get(`/performance/cat?genre=${genre}`);
  },
  getPerformanceSession: (prf_session_id: string | undefined) => {
    //공연의 회차를 클릭하면 남은 좌석에 대한 정보를 불러옴
    return client.get(`/performance/session/${prf_session_id}`);
  },
  checkReservation: (data: ICheckReservationData) => {
    //예약하기 버튼을 눌렀을 때 유저가 선택한 회차에 선택한 인원 수 만큼 예약이 가능한지 확인 후 결제하기 페이지로 넘어감
    return client.post(`/performance/rsv/check`,data);
  },
  widthdrawReservation: (data: ICheckReservationData) => {
    //결제 페이지에서 취소를 눌렀을 때 또는 브라우저 상태 변경(종료, 새로고침, 이동 등) 이벤트가 발생할 때 대기열에서 사용자 삭제 
    return client.post(`/performance/rsv/withdraw`,data);
  },
  
};

export default PerformanceAPI;