import { createChat, CancelledCompletionError } from "completions";
import dotenv from "dotenv";
dotenv.config()
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
      {
        name: "even_odd_check",
        description: "Check if a number is even or odd",
        parameters: {
          type: "object",
          properties: {
            number: {
              type: "integer",
              description: "The number to check",
            },
          },
          required: ["number"],
        },
        function: async ({ number }) => {
          const isEven = number % 2 === 0;
          return {
            isEven,
          };
        },
      },
      {
        name: "prime_number_check",
        description: "Check if a number is a prime number",
        parameters: {
          type: "object",
          properties: {
            number: {
              type: "integer",
              description: "The number to check",
            },
          },
          required: ["number"],
        },
        function: async ({ number }) => {
          if (number <= 1) {
            return {
              isPrime: false,
            };
          }
          for (let i = 2; i <= Math.sqrt(number); i++) {
            if (number % i === 0) {
              return {
                isPrime: false,
              };
            }
          }
          return {
            isPrime: true,
          };
        },
      },
    ],
    functionCall: "auto",
  });
 async function main(){
    const response1 = await chat.sendMessage("my mother is telling me whether 13 is prime?");
    console.log(response1.content);

    const response2 = await chat.sendMessage("Check whether 79 is odd or even");
    console.log(response2.content);

    const response3 = await chat.sendMessage("IS 189847 a odd number as well as is it a prime number or not");
    console.log(response3.content);

    const response4 = await chat.sendMessage("can you tell me what is 13 a prime or odd");
    console.log(response4.content);
 } 
  main()

