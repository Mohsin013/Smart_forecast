import {OpenAI} from "openai";

import dotenv from "dotenv";
import express from "express";
import cors from "cors";

const app = express();
const port = 8080;
const openai = new OpenAI({
  organization:"org-dEpCL7ls2XHjwFwFgIorS9v6",
  apiKey:process.env.OPENAI_API_KEY
});
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static('client')); // Assuming your client files are in a 'client' directory

let Key =  process.env.WEATHER_API_KEY;


async function get_current_weather( location ){
  console.log(Key)
  let res_single = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${Key}&units=metric&sys=unix`);
  let data= await res_single.json();
  console.log("get_current_weather",data)
  return data
}

  const tools = [
      {
        name: "get_current_weather",
        description: "Get the current weather and overall climate in a given location and give a detailed output",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA, Mumbai",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    ];
    




app.post('/bot', async (req, res) => {
  console.log(req.body)
  let userMessage= req.body
  userMessage=userMessage.userMessage
  console.log(userMessage)

  try {

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{"role":"system","content":"You are a helpful assistant who must resolve the user queries including telling the current weather of a location","role": "user", "content":`${userMessage}` }],
      functions: tools, 
      function_call: "auto",
    });
    console.log("reached here")
    console.log(response.choices[0].finish_reason)
    if (response.choices[0].finish_reason=="stop"){
      console.log("hiii")
      let result=response.choices[0].message.content
      res.json({"message":result})
    }

    let wants_to_use_function = response.choices[0].finish_reason == "function_call"

    if (wants_to_use_function){
      if(response.choices[0].message.function_call.name == "get_current_weather"){
        let args = JSON.parse(response.choices[0].message.function_call.arguments)
        let data = await get_current_weather(args.location)
        const response2 = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{"role": "user", "content": `generate an engaging response about the current weather weather details :location: ${data.name},temperature: ${data.main.temp},
          humidity:${data.main.humidity},
          unit: "celcius",
          type:${data.weather[0].main},
          description: ${data.weather[0].description},
          information:${data}`}],
        });

        let result =response2.choices[0].message.content
        res.json({"message": result});

      }
    }   
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

