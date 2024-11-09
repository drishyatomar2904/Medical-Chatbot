import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState("");   
  const [answer, setAnswer] = useState([]);

  async function generateAnswer() {
    setAnswer(["Loading..."]);
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDe73-sa1JxaqOy1ExHanuDAcTGZ3sCIyM",
        method: "post",
        data: {
          contents: [
            { parts: [{ text: question }] }
          ]
        }
      });

      const rawAnswer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
      const cleanedAnswer = rawAnswer.replace(/[*#]/g, '').trim();

      const formattedAnswer = cleanedAnswer
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);

      setAnswer(formattedAnswer);
    } catch (error) {
      setAnswer(["An error occurred. Please try again."]);
      console.error("Error fetching response:", error);
    }
  }

  // Render function with conditional bullet points for main points only
  const renderList = (lines) => (
    <div style={{ paddingLeft: "20px" }}>
      {lines.map((line, index) => (
        // Apply bullet style only to lines with certain keywords or criteria
        <div key={index} style={{ marginBottom: "5px" }}>
          {line.startsWith("•") ? (
            <li style={{ listStyleType: "disc" }}>{line.replace(/^•/, '')}</li>
          ) : (
            <p style={{ margin: 0, paddingLeft: "15px" }}>{line}</p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <h1>HealthBuddy Medical Chatbot</h1>
      <textarea
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
        cols="30" 
        rows="10"
        placeholder="Type your question here..."
      ></textarea>
      <button onClick={generateAnswer}>Generate Answer</button>
      <div style={{ 
        lineHeight: "1.5em", 
        textAlign: "left", 
        color: "#333",            
        fontWeight: "bold",       
        fontSize: "1.1em",        
        fontFamily: "Arial, Helvetica, sans-serif", 
        paddingLeft: "20px"       
      }}>
        {answer.length ? renderList(answer) : "What can I do for you today? 😊"}
      </div>
    </>
  );
}

export default App;
