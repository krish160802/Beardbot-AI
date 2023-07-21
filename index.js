const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const path=require('path')
const port=process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const openaiKey = process.env.OPENAI_KEY;

app.post("/chat",async(req,res)=>{

    const { messages } = req.body;

    if (!Array.isArray(messages) || !messages.length) {
        res.status(400).json({
        success: false,
        message: "messages required",
        });

        return;
    }


    let requiredPrompt ="The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n" + 
    messages.map((item) => `${item.from == "ai" ? "AI: " : "Human: "}${item.text}`).join("\n") +"\nAI: ";

    const reqUrl = "https://api.openai.com/v1/completions";

    const reqBody = {
    "model": "text-davinci-003",
    prompt:requiredPrompt,
    "max_tokens": 200,
    "temperature": 0.5,
  }

    try {
        
        const response = await axios.post(reqUrl, reqBody, {
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${openaiKey}`,
            },
        });

        const data = response.data;
        const ans = Array.isArray(data.choices) ? data.choices[0]?.text : "";

        res.status(200).json({
            success: true,
            data: ans.trim(),
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message|| "Something went wrong Look out!",
            error:err,
        });
    }

});

if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'frontend','build')));
// console.log(path.join(__dirname,'client','build'))
    app.get('/*',(req,res)=>{
        // res.send("lo")
         res.sendFile(path.join(__dirname,'frontend','build','index.html'))
    })  
} 




app.listen(5000, ()=>console.log("Server is up"));

