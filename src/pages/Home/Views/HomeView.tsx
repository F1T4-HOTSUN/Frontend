import styled from "@emotion/styled"
import React, { useEffect, useState } from "react"
import CarouselView from "./CarouselView";

const MainContainer = styled.div`
    padding: 1rem;
    padding-top: 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;

    @media (max-width: 767px){
        grid-template-columns: repeat(2, 1fr);
        width: fit-content;
    }
`
const HomeView = ({top10,onGoToDetail}:any) => {
    const [top10List,setTop10List]=useState([]);

   
    useEffect(()=>{
        
        setTimeout(()=>{
            setTop10List(top10)
            console.log(top10List)
        },150)
    })
    return (
        <div style={{display:'flex',flexDirection:'column',width:'100%'}}>
        {/* <div style={{width:'100%', height:'15rem',backgroundColor:'#B65C87'}}>

        </div> */}
        {/* <div className="container">
        <div className="slide">
                <div style={{display:'flex',justifyContent:'space-between',width:'100%',height:'fit-content',position:'absolute',zIndex:'1'}}>
                    <div className="btn" onClick={() => { moveSlide(-1); }}>&lt;</div>
                    <div className="btn" onClick={() => { moveSlide(1); }}>&gt;</div>
                </div>
                <div className="window">
                    <div className="flexbox" style={style}>
                        {images.current.map((img, i) => (
                        <div key={i} className="img" style={{ backgroundImage: `url(${img})` }}></div>
                            // 
                        ))} 
                        <img key={img1} className="img" src={img1} alt={"1"}></img>
                        <img key={img2} className="img" src={img2} alt={"2"}></img>
                        <img key={img3} className="img" src={img3} alt={"3"}></img>
                    </div>
                </div>
            </div> */}
            
                {/* <div className="window">
                    <div style={{display:'flex',justifyContent:'space-between',width:'100%',height:'fit-content',position:'absolute',zIndex:'1'}}>
                        <div className="btn" onClick={() => { moveSlide(-1); }}>&lt;</div>
                        <div className="btn" onClick={() => { moveSlide(1); }}>&gt;</div>
                    </div>
                    <div className="flexbox" style={style}>
                        {/* {images.current.map((img, i) => (
                        <div key={i} className="img" style={{ backgroundImage: `url(${img})` }}></div>
                            // 
                        ))} 
                        <img key={img1} className="img" src={img1} alt={"1"}></img>
                        <img key={img2} className="img" src={img2} alt={"2"}></img>
                        <img key={img3} className="img" src={img3} alt={"3"}></img>
                    </div>
                </div>
                <div className="position">
                    {images.current.map((x, i) => (
                        <div key={i} className={i === current ? 'dot current' : 'dot'}></div>))}
                </div>
        </div> */}
        <CarouselView/>

        {/* <div style={{padding:'1rem',paddingTop:'0',display:'grid' ,gridTemplateColumns: 'repeat(5, 1fr)',gap:'1rem'}}> */}
        <p style={{margin:'0.7rem 0 1rem 1rem',fontSize:'1.7rem',fontWeight:'500'}}>오늘의 TOP 10!</p>
        <MainContainer>
            
            {
                top10List.length!==0
                ?top10List.map((el:any)=>{
                    return(
                        <div key={el.prfId} style={{width:'13rem',cursor:'pointer'}}  onClick={()=>onGoToDetail(el.prfId)}>
                            <div style={{textAlign: 'center'}}>
                                <div style={{position:'relative'}}>
                                    <img src={el.poster} style={{width:'9rem',height:'11.7rem',borderRadius:'5px'}} alt={el.prfId}/>
                                    <span style={{textShadow: '2px 2px 4px rgba(50, 50, 50, 0.53)',position:'absolute',color:'#ffffff',left:'2rem',bottom:'-0.3rem',fontSize:'3.5rem',fontWeight:'700',letterSpacing:'-0.5rem'}}>{el.rnum}</span>
                                </div>
                            </div>
                            <p style={{margin:'0.3rem 0',fontSize:'1.25rem',fontWeight:'500',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{el.title}</p>
                            <p style={{margin:'0.3rem 0',color:'#575757',fontSize:'1rem',fontWeight:'300',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>{el.facilityName}</p>
                            <p style={{margin:'0.3rem 0',color:'#A6A6A6',fontSize:'1rem',fontWeight:'300'}}>{el.startDate}~{el.endDate}</p>
                            {/* <Button 
                                size='md'
                                color='blue'>예매하기</Button> */}
                        </div>
                    )
                })
                :
                Array(10).fill(0).map((_,idx)=>{
                    return(
                    <div key={idx} style={{}}>
                        <div style={{justifyContent: 'center',display:'flex'}}>
                            
                            <div style={{width:'9rem',height:'11.7rem',borderRadius:'5px',backgroundColor:'#B8B8B8'}}></div>
                            
                        </div>
                        <p style={{margin:'0.3rem 0',borderRadius:'5px',width:'100%',backgroundColor:'#B8B8B8',color:'#B8B8B8',fontSize:'1.25rem',fontWeight:'500',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>performance name</p>
                        <p style={{margin:'0.3rem 0',borderRadius:'5px',width:'fit-content',backgroundColor:'#B8B8B8',color:'#B8B8B8',fontSize:'1rem',fontWeight:'300',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden'}}>performance place</p>
                        <p style={{margin:'0.3rem 0',borderRadius:'5px',width:'fit-content',backgroundColor:'#B8B8B8',color:'#B8B8B8',fontSize:'1rem',fontWeight:'300'}}>yyyy.mm.dd~yyyy.mm.dd</p>
                        {/* <Button 
                            size='md'
                            color='gray'>예매하기</Button> */}
                    </div>)              
                })
            }
        {/* </div> */}
        </MainContainer>
    </div>
    )
}

export default React.memo(HomeView)