import React, { useRef, useState } from "react";
import styles from './App.module.css';
import beardman from './beard-man.png'; 
import { Send } from "react-feather";

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
        <input 
          placeholder="How may I assist you"
          value={msgTxt}
          onChange={(e)=>setMsgTxt(e.target.value)}  
        />

        <div className={styles.btn} onClick={submit}>
          <div className={styles.icon}>
            <Send/>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
