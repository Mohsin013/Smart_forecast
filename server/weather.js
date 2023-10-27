import { createChat, CancelledCompletionError } from "completions";
import dotenv from "dotenv";
dotenv.config();
let Key = "75b4deaaed93244bc6d514ed7bbaf79a";
const chat = createChat({
    apiKey: process.env.API_KEY,
    model: "gpt-3.5-turbo-0613",
    functions: [
      {
        name: "get_current_weather",
        description: "Get the current weather in a given location.",
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
          console.log(location)
            let res_single = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${Key}&units=metric&sys=unix`);
            let data= await res_single.json();
            console.log(data)
           
          return {
            location: data.name, //weather api dehli
            temperature: data.main.temp,  //weather api 33', c
            unit: "celcius",
          };
        },
      },
    ],
    functionCall: "auto",
  });

  async function main(){
    const response1 = await chat.sendMessage("how is the weather in delhi");
    console.log(response1.content);
 } 
  main()


  //input {location} dehli, mumbai;
  // output {json object} // user responsive data
  

  // what is the weather in dehli; i an dehli what is temp? // weather api// param {location}
  // the weather is dehli is warm and the temp is "26'c"


  