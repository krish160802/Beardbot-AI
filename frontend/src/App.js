import React, { useEffect, useRef, useState } from "react";
import {Helmet} from 'react-helmet';
import styles from './App.module.css';
import beardman from './beard-man.png'; 
import { Mic, Send } from "react-feather";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function App() {

  

  const lastMsg = useRef();


  const [msgTxt, setMsgTxt] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi there! I'm you AI assistant, I'm here to help you with your queries. Ask me anything you want.",
    },
  ]);
  const [processing, setProcessing] = useState(false);

  const {
    transcript,
    listening,
  } = useSpeechRecognition();

  
  useEffect(()=>{
    setMsgTxt(transcript);
  },[transcript])
  
  const submit = async () =>{


    if(!msgTxt.trim() || processing){
      return;
    }

    const tempMessages = [
      ...messages,
      {
        from: "human",
        text: msgTxt,
      },
    ];

    setMessages(tempMessages);
    setMsgTxt("");

    setTimeout(() =>
      lastMsg.current.scrollIntoView({
        behavior: "smooth",
      })
    );

    try {
      setProcessing(true);
      const res = await fetch(`/chat`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          messages: tempMessages.slice(-6),
        }),
      });
      setProcessing(false);

      const data = await res.json();
      // console.log(data);
      const ans = data.data;

      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: ans,
        },
      ]);

    } catch (error) {
      console.log(error);
      const err = "Error ! Try again after some time"

      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: err,
        },
      ]);

      setTimeout(() =>
      lastMsg.current.scrollIntoView({
        behavior: "smooth",
      })
    );

    }


  };

  return (
    <div className={styles.app}>
      <Helmet>
        <style>{'body { background: rgba(1, 48, 45, 0.788); padding: 30px; }'}</style>
      </Helmet>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.image}>
            <img src={beardman} alt="img"/>
          </div>
          <marquee scrolldelay="180"><p>BEARD-O-BOT</p></marquee>
        </div>
      </div>

      <div className={styles.body}>
        {messages.map((msg,index) =>(
          <div 
            className={`${styles.message} ${msg.from=="ai" ? styles.mleft : styles.mright}`}
            key={index}
          >
          {msg.from == "ai" ? (
              <div>
                <div className={styles.image}>
                  <img src={beardman} alt="AI" />
                </div>
              </div>
            ) : (
              ""
          )}
          <p className={styles.text}>{msg.text}</p>
          </div>
        ))}

        {processing ? (
          <div className={styles.typing}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        ) : (
          ""
        )}

        <div ref={lastMsg} />

      </div>

      <div className={styles.footer}>
      {/* {listening ? <Helmet>
        <style>{' { background: "pink"); }'}</style>
      </Helmet>:""} */}
        <input 
          className="inp"
          placeholder="How may I assist you"
          value={msgTxt}
          
          onChange={(e)=>setMsgTxt(e.target.value)}  
        />

        <div className={styles.btn} onClick={submit}>
          <div className={styles.icon}>
            <Send/>
          </div>
        </div>

        <div className={styles.btn} onClick={SpeechRecognition.startListening}>
          <div className={styles.icon}>
            <Mic/>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;