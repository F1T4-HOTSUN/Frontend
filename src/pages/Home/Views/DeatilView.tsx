import { Button } from "@mui/material";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from 'date-fns/locale/ko';
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../Map";
import styled from "@emotion/styled";
import './custom-datepicker.scss';
import useCheckReservation from "../../../hooks/mutation/performance/useCheckReservation";
import useGetPerformanceSession from "../../../hooks/query/performance/useGetPerformanceSession";
import React from "react";
import noPoster from "../../../assets/images/noPoster.png"
import useToastMessage from "../../../hooks/common/useToastMessage";

const SessionButton = styled(Button)`
    
    height: fit-content;
    
    padding: 0.2rem 0.4rem;
    font-size: 1.1rem;
    color: #858585;
    
    border:0.2rem #CACACA solid;
    border-radius: 2rem;

    &:hover {
        border:0.2rem #FF7F8F solid;
        background: #ffffff;
    }

    &.active{
        border:0.2rem #FF7F8F solid;
        color: #333;
    }

`;

const ReservationButton = styled(Button)`
    
    
    width: 100%;
    height: fit-content;
    padding: 0.7rem 3rem;
    font-size: 1.1rem;
    color: #ffffff;
    background: #FF7F8F;
    
    
    border-radius: 2rem;

    &:hover {
        background: #E57583;
    }

    
`;

const DeatilView = ({performanceData}:any) => {

    registerLocale("ko", ko); //한국어 설정
    
    const [selectedDate,setSelectedDate] = useState(performanceData.data.performanceDetailInfo.startDate)
    
    // const [sessionTimeList,setSessionTimeList] = useState(performanceData.data.prfSessionList[0].filter((data: { prfSessionId: string,prfSessionDate: string,prfSessionTime:string,available:boolean })=>data.prfSessionDate===selectedDate))
    const [sessionTimeList,setSessionTimeList] = useState([performanceData.data.prfSessionList[0]])
    
    // console.log(sessionTimeList)
    //const [selectedTime,setSelectedTime] = useState(sessionTimeList.length<=1?sessionTimeList.prfSessionTime:sessionTimeList[0].prfSessionTime)
    const [selectedTime,setSelectedTime] = useState(sessionTimeList[0].prfSessionTime)
    const [selectedTimeId,setSelectedTimeId] = useState(sessionTimeList[0].prfSessionId)
    
    
    const [seatType,setSeatType] = useState('')
    const [seatPrice,setSeatPrice] = useState(0)
    
    
    const [inform,setInform] = useState('pf')
    const navigate=useNavigate()
    
    
    const onChangeDate = (e:any) =>{
        
        if(performanceData.data.prfSessionList.some((item:any) => item.prfSessionDate===`${new Date(e).getFullYear()}-${new Date(e).getMonth()>=10?new Date(e).getMonth()+1:'0'+(new Date(e).getMonth()+1)}-${new Date(e).getDate()>=10?new Date(e).getDate():'0'+(new Date(e).getDate())}`)){
            setSelectedDate(`${new Date(e).getFullYear()}-${new Date(e).getMonth()>=10?new Date(e).getMonth()+1:'0'+(new Date(e).getMonth()+1)}-${new Date(e).getDate()>=10?new Date(e).getDate():'0'+(new Date(e).getDate())}`)
        setSelectedTime('')
        setSessionTimeList(performanceData.data.prfSessionList.filter((data: { prfSessionId: string,prfSessionDate: string,prfSessionTime:string,available:boolean })=>data.prfSessionDate===`${new Date(e).getFullYear()}-${new Date(e).getMonth()>=10?new Date(e).getMonth()+1:'0'+(new Date(e).getMonth()+1)}-${new Date(e).getDate()>=10?new Date(e).getDate():'0'+(new Date(e).getDate())}`))
        }
        else{
            //alert("해당 날짜에는 공연이 없습니다!")
            showToast("warning","해당 날짜에는 공연이 없습니다!")
        }
    }
    
    

    // useEffect(()=>{
    //     // setSessionTimeList(performanceData.prfSessionList.filter((data: { prfSessionId: string,prfSessionDate: string,prfSessionTime:string,available:boolean })=>data.prfSessionDate===selectedDate))
        
    // },[customHistory]);

    const { data } = useGetPerformanceSession(selectedTimeId);
    
    const selectSessionTime = (id:string, time:string) => {
        // alert(`${id}, ${time}`);
        setSelectedTimeId(id)
        setSelectedTime(time)
    }

    const onSetSeatType = (seat_type:string, seat_price:string) => {
        setSeatType(seat_type)
        setSeatPrice(Number(seat_price))
    }

    const [people,setPeople] = useState(1)


    const { mutate: checkReservationMutate } = useCheckReservation(navigate);
    const showToast = useToastMessage();
    const goReservation = () => {
        console.log(data)
        if(selectedTime&&seatType&&(data!.remainingSeat>=people)){
            //alert(`${selectedDate} ${selectedTime}회차 ${seatType} ${people}명  총 ${seatPrice*people}원`)
            //showToast('success',`${selectedDate} ${selectedTime}회차 ${seatType} ${people}명  총 ${seatPrice*people}원`)
        }else if(!(selectedTime&&seatType)){
            showToast('warning','회차 및 좌석을 선택해 주세요!')
            return;
        }
        else if(data!.remainingSeat<people){
            showToast('error','예약이 불가능합니다😭')
            return;
        }
            if(localStorage.getItem("accessToken")){
                let reservationInfo = {
                    selectedDate:selectedDate,
                    selectedTime:selectedTime,
                    people:people,
                    seatType: seatType,
                    seatPrice: seatPrice,
                    detail:performanceData,
                }
                checkReservationMutate({checkData:{"prfSessionId":selectedTimeId,"count":people},"reservationInfo":reservationInfo})
            }else{
                // alert('로그인해주세요!')
                showToast('warning','로그인해주세요!')
                navigate('/login')
            }
        
        
    }
    
    const onSetInform = (i:string) => {
        setInform(i)
    }

    const onSetPeople = (amount:number) => {
        if(amount <0){
            people===1
            ? showToast('warning','선택 가능한 최소 인원은 1명입니다!')
            : setPeople(people-1);
        }else{
            setPeople(people+1);
        }
    }
    const seat_grade = ["#FF7F8F","#94B74B","#B65C87","#598A9E","#F0CC86"]

    
        
    return(
        
            <div style={{padding:'2rem 1rem',display:'flex',flexDirection:'column',width:'100%'}}>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            {/* InfoView {pfId} */}
                <div style={{display:'flex',flexDirection:'row',gap:'1.3rem',marginTop:'1rem',flex:'1'}}>
                {performanceData.data.performanceDetailInfo.poster?
                    <img src={performanceData.data.performanceDetailInfo.poster} alt={performanceData.data.performanceDetailInfo.title} style={{width:'9rem',height:'11.7rem',borderRadius:'5px'}}/>
                    :<img src={noPoster} alt={performanceData.data.performanceDetailInfo.title} style={{width:'9rem',height:'11.7rem',borderRadius:'5px'}}/>
                }
                    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',width:'100%'}}>
                        
                        <span style={{width:'fit-content',fontSize:"1.5rem", fontWeight:'500', margin:'0',whiteSpace:'pre-line',wordWrap:'break-word'}}>{performanceData.data.performanceDetailInfo.title}</span>
                        <span style={{width:'fit-content',fontSize:"0.9rem", color:'#575757', padding:'0', margin:'0.1rem 0 0 0'}}>장소 | {performanceData.data.facilityDTO.facilityName}</span>
                        {performanceData.data.performanceDetailInfo.runtime?
                        <span style={{width:'fit-content',fontSize:"0.9rem", color:'#575757', padding:'0', margin:'0.1rem 0 0 0'}}>관람시간 | {performanceData.data.performanceDetailInfo.runtime}</span>
                        :
                        <span style={{width:'fit-content',fontSize:"0.9rem", color:'#575757', padding:'0', margin:'0.1rem 0 0 0'}}>관람시간 | 미정</span>
                        }
                        <span style={{width:'fit-content',fontSize:"0.9rem", color:'#575757', padding:'0', margin:'0.1rem 0 0 0'}}>관람등급 | {performanceData.data.performanceDetailInfo.viewingAge}</span>
                        <span style={{width:'fit-content',fontSize:"0.9rem", color:'#575757', padding:'0', margin:'0.1rem 0 0 0'}}>기간 | {performanceData.data.performanceDetailInfo.startDate} ~ {performanceData.data.performanceDetailInfo.endDate}</span>
                        
                    </div>
                </div>
                
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',flex:'1'}}>
                <DatePicker
                        wrapperClassName="datepicker"
                        selected={new Date(selectedDate)}
                        highlightDates={performanceData.data.prfSessionList.map((data: { prfSessionDate: string | number | Date; })=>new Date(data.prfSessionDate))}
                        onChange={onChangeDate}
                        disabledKeyboardNavigation //다른 월의 같은 날짜시 자동 selected 되는 현상 방지
                        locale="ko" 
                        inline
                        minDate={new Date(performanceData.data.performanceDetailInfo.startDate)}
                        maxDate={new Date(performanceData.data.performanceDetailInfo.endDate)}
                        popperPlacement="auto" //화면 중앙에 팝업이 출현
                    />
                    
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gridTemplateRows:'repea(4,1fr)',gap:'1.3rem',marginTop:'0.5rem'}}>
                        <div style={{gridRow:'span 3'}}>
                            <div style={{display:'flex', flexDirection:'column',gap:'0.5rem'}}>
                            {
                                sessionTimeList.map((sessionTime:any)=>{
                                    return(
                                    // <span style={{border:'0.2rem #FF7F8F solid', borderRadius:'2rem', padding:'0.3rem 1rem',fontSize:'1.3rem',color:'#858585'}}>{time}</span>
                                        <SessionButton key={sessionTime.prfSessionId} className={sessionTime.prfSessionId===selectedTimeId?'active':'inactive'} value={sessionTime.prfSessionTime} size="large" variant="outlined" id={sessionTime.prfSessionId}  onClick={()=>selectSessionTime(sessionTime.prfSessionId,sessionTime.prfSessionTime)}>{sessionTime.prfSessionTime}</SessionButton>
                                        
                                    )
                                })
                            }
                            </div>
                        </div>
                        <div style={{gridRow:'span 3'}}>
                            <div style={{display:'flex', flexDirection:'column',gap:'0.5rem'}}>
                            
                            {
                            performanceData.data.performanceDetailInfo.ticketPrice.map((seat: any,idx:number)=>{
                                return(
                                    seatType===seat.seatType
                                    ?<p key={seat.seatType} style={{margin:'0 0 1rem 0',cursor:'pointer',verticalAlign:'middle'}} onClick={()=>onSetSeatType(seat.seatType,seat.price)}><span style={{fontSize:'1.3rem',marginRight:'1rem',color:`${seat_grade[idx]}`,userSelect:'none',verticalAlign:'middle'}}>■</span>{seat.seatType} | {Number(seat.price).toLocaleString('ko-KR')}원</p>
                                    :<p key={seat.seatType} style={{margin:'0 0 1rem 0',cursor:'pointer',verticalAlign:'middle'}} onClick={()=>onSetSeatType(seat.seatType,seat.price)}><span style={{fontSize:'1.3rem',marginRight:'1rem',color:`${seat_grade[idx]}`,userSelect:'none',verticalAlign:'middle'}}>□</span>{seat.seatType} | {Number(seat.price).toLocaleString('ko-KR')}원</p>
                                    
                                )
                            })
                        }
                            </div>
                        </div>
                        
                            <div style={{display:'flex',flexDirection:'row',height:'fit-content',alignItems:'center',gap:'3rem',border:'0.3rem #CACACA solid', borderRadius:'2rem',padding:'0.5rem 1rem',userSelect:'none'}}>
                                <span style={{cursor:'pointer',fontSize:'1.5rem'}} onClick={()=>onSetPeople(-1)}>-</span>
                                <p style={{fontSize:'1.5rem', margin:'0'}}>{people}</p>
                                <span style={{cursor:'pointer',fontSize:'1.5rem'}} onClick={()=>onSetPeople(+1)}>+</span>
                            </div>
                        
                            <ReservationButton size="large" onClick={()=>goReservation()}>
                                예매하기
                            </ReservationButton>
    
                    </div>
                </div>
            </div>
    
            
            
            {
                inform==='pf'
                ? 
                <>
                    <div>
                <ul style={{display: 'flex', flexWrap:'wrap', listStyle:'none',paddingLeft:'0px',margin:'0',paddingRight:'10rem',gap:'2rem'}}>
                    <li key='pfpf' style={{cursor:'pointer',userSelect:'none'}} onClick={()=>onSetInform('pf')}>
                        
                            <p style={{display: 'inline-block', padding: '5px 10px',marginBottom: '0.7rem',borderBottom:'0.35rem #FF7F8F solid'}}>공연 상세 정보</p>
                        
                        
                    </li>
                    <li key='pfpl' style={{cursor:'pointer',userSelect:'none'}} onClick={()=>onSetInform('pl')}>
                        
                            <p style={{display: 'inline-block', padding: '5px 10px',marginBottom: '0.7rem'}}>장소 정보</p>
                        
                    </li>
                </ul>
            </div>
                
                <div style={{display:'flex',flexDirection:'column',justifyItems:'center'}}>
                
                {
                    performanceData.data.performanceDetailInfo.styUrls.map((url: string | undefined,idx: any)=>{
                        return(<img key={idx} src={url} alt={`공연 상세 정보 ${idx}`} style={{display:'block',margin:'auto',width:'fit-content'}}/>)})
                }
                </div>
                </>
                :
                
            <>
            <div>
                <ul style={{display: 'flex', flexWrap:'wrap', listStyle:'none',paddingLeft:'0px',margin:'0',paddingRight:'10rem',gap:'2rem'}}>
                    <li key='plpf' style={{cursor:'pointer',userSelect:'none'}} onClick={()=>onSetInform('pf')}>
                        <p style={{display: 'inline-block', padding: '5px 10px',marginBottom: '0.7rem'}}>공연 상세 정보</p>
                    
                    </li>
                    <li key='plpl' style={{cursor:'pointer',userSelect:'none'}} onClick={()=>onSetInform('pl')}>
                    
                        <p style={{display: 'inline-block', padding: '5px 10px',marginBottom: '0.7rem',borderBottom:'0.35rem #FF7F8F solid'}}>장소 정보</p>
                        
                    </li>
                </ul>
            </div>
            
                <div style={{display:'flex',flexDirection:'row',justifyItems:'center',gap:'2rem'}}>
                    <Map lat={Number(performanceData.data.facilityDTO.latitude)} lng={Number(performanceData.data.facilityDTO.longitude)}/>
                    <div>
                        <p>장소 | {performanceData.data.facilityDTO.facilityName}</p>
                        <p>주소 | {performanceData.data.facilityDTO.address}</p>
                        <p>대표번호 | {performanceData.data.facilityDTO.telNo}</p>
                    </div>
                </div> 
            </>
            
        }
    
        </div>

    )
    
}

export default React.memo(DeatilView)