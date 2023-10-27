import { createChat } from "completions";
import dotenv from "dotenv";
dotenv.config();


const chat = createChat({
    apiKey: process.env.API_KEY,
    model: "gpt-3.5-turbo-0613",
    functions: [
      {
        name: "sum_of_two_numbers",
        description: "Calculate the sum of two integers",
        parameters: {
          type: "object",
          properties: {
            firstNumber: {
              type: "integer",
              description: "The first integer",
            },
            secondNumber: {
              type: "integer",
              description: "The second integer",
            },
          },
          required: ["firstNumber", "secondNumber"],
        },
        function: async ({ firstNumber, secondNumber }) => {
          const sum = firstNumber + secondNumber;
          return {
            result: sum,
          };
        },
      },
    ],
    functionCall: "auto",
  });

  async function main(){
    const reponse = await chat.sendMessage("what is the sum of 10 and 14 and 18")
    console.log(reponse.content);
 } 
  main()


  // 10 ist integer  + 14 2nd = 24 result