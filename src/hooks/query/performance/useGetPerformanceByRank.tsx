import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import PerformanceAPI from "../../../api/performance";
import { IPerformanceByRankResponse } from "../../../types/performance";

const useGetPerformanceByRank = () => {
    return useQuery(["getPerformanceByRank"], () => PerformanceAPI.getPerformanceByRank(), {
        select: (data: AxiosResponse<IPerformanceByRankResponse>) => {
            console.log('불러온 데이터 : ', data.data.data)
            
            return data.data.data;
        },
    });
}

export default useGetPerformanceByRank