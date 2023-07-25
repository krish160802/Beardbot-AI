import React, { useEffect, useState } from "react";
import "./Background.css";
import App from "./App";
const Background = () => {
  const [loader,setLoader] = useState(true);

  const handleTimer = ()=>{
    let t = 0;

    let interval = setInterval(()=>{
      t++;
      if(t==5){
        clearInterval(interval);
        setLoader(false);
      }
    },1000)

    

    console.log(t);
  } 

  useEffect(()=>{
    handleTimer();
  },[])
  return (
    <div >
    {loader?<div  class="loader">
        
        <h1>BEARDOBOT</h1>
        
      </div>:<App/>}
      
    </div>
  );
};

export default Background;
