const express = require('express');
const cors = require('cors');


const app = express();
const port = 5000; 

app.use(express.json());
app.use(cors());  

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).send({ error: 'Message is required' });
    }

     try{
        const response = await chat(userMessage);
        res.json(response);
     }
     catch(error){
      res.json({msg : "server error"});
     }
    

  })

  app.listen(5000,() => {
    console.log("listening on 5000");
  })


async function chat(userResp){
    const apiKey = 'AIzaSyBBqnpw-ogs5u9--7EiUpiMNztEykkA7XI'; // Replace with your actual API key

    try {
      const prompt = `You are going to generate code for a web site using html, css and javascript the user will give you the prompt like what kind of website they want to create and then you
     have to genrate the code for html, css, javascript and the response would be in this format {"aiResponse" : "your response", "html" : "html code",
     "css" : "css code", "js" : "js code"} don't give any new lines or spaces before the response . the user prompt is ${userResp}`;
      console.log(prompt);
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBBqnpw-ogs5u9--7EiUpiMNztEykkA7XI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "contents": [{ "parts": [{ "text": prompt }] }] }),
      });

      if (geminiResponse.ok) {
        const result = await geminiResponse.json();
        //console.log(result.candidates[0].content.parts[0].text);
        response = result.candidates[0].content.parts[0].text;
        //console.log(response);
        response = JSON.parse(response);
        console.log(response);
        console.log(response["aiResponse"]);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error:', error.message);
      response = 'Error occurred while detecting fake news.';
    }
    return response;

}
