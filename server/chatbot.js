import { createChat, CancelledCompletionError } from "completions";
import dotenv from "dotenv";
import express from "express"
// const express = require('express');
const app = express();
const port = 8080; // Choose any port you prefer
// const cors = require('cors');
import cors from "cors"
import bodyParser from "body-parser";
import axios from "axios";
// const bodyParser = require('body-parser');
dotenv.config()
app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('client')); // Assuming your client files are in a 'client' directory
// const axios = require('axios');

let Key = "75b4deaaed93244bc6d514ed7bbaf79a";
const chat = createChat({
    apiKey: process.env.API_KEY,
    model: "gpt-3.5-turbo-0613",
    functions: [
      {
        name: "get_current_weather",
        description: "Get the current weather and overall climate in a given location and give a detailed output",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
        function: async ({ location }) => {
            let res_single = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${Key}&units=metric&sys=unix`);
            let data= await res_single.json();
            // console.log(data)

         
           
          return {
            location: data.name, //weather api
            temperature: data.main.temp,  //weather api
            humidity:data.main.humidity,
            unit: "celcius",
            type:data.weather[0].main,
            description: data.weather[0].description,
            explain:"Explain all these parameters in a news forcast way",
            information:data
          };
        },
      },
    ],
    functionCall: "auto",
  });


app.post('/bot', async (req, res) => {
  const { userMessage } = req.body;
  console.log(userMessage)

  try {
    const response = await chat.sendMessage(userMessage)
    // console.log(response)
    const result= response.content
   console.log(result)

    res.json({ result });
  } catch (error) {
    console.error(error);
    const message= "It seems that the answer to this question isn't available. Could you please try rephrasing the question or check if there might be an issue with it? I'm looking forward to assist you!"
    res.json({message });
  }
});







app.listen(port, () => {
    try {
        console.log('listening on port 8080');
    } catch (error) {
        console.log(error);
    }
})

