import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";

import { TNavigate } from "../../../types/navigate";
import ReservationAPI from "../../../api/reservation";
import { IReservationInfo, IReservationResponse } from "../../../types/reservation";

const useCreateReservation = (navigate:TNavigate) => {
    return useMutation((reservationInfo: IReservationInfo) => ReservationAPI.createReservation(reservationInfo), {
        onSuccess: (data: AxiosResponse<IReservationResponse>,variables:IReservationInfo) => {
            alert('예매 완료!');
            console.log(data);
            navigate('/reservation',{state: variables})
        },
        onError: ((error: unknown, variables: IReservationInfo, context: unknown) =>{
            alert('예매 실패!');
            console.log(error);
            console.log(variables);
        })
    });
};

export default useCreateReservation;
