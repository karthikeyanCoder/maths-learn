
// // frontend/src/components/ChatBox.js
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import Message from './Message';
// import Avatar from './Avatar';
// import './ChatBox.css';
// import BASE_URL from '../backend';
// const ChatBox = () => {
//   const [messages, setMessages] = useState([]);
//   const [question, setQuestion] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const audioRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const speak = (audioData) => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//     }
    
//     const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
//     const audioUrl = URL.createObjectURL(audioBlob);
//     audioRef.current = new Audio(audioUrl);
    
//     audioRef.current.onplay = () => setIsSpeaking(true);
//     audioRef.current.onended = () => setIsSpeaking(false);
//     audioRef.current.play();
//   };

//   const sendQuestion = async () => {
//     if (!question.trim() || loading) return;

//     const userMsg = { role: 'user', text: question };
//     setMessages(prev => [...prev, userMsg]);
//     setQuestion('');
//     setLoading(true);

//     try {
//       const res = await axios.post(`${BASE_URL}/api/ai/ask`, { question });
//       const aiMsg = { 
//         role: 'ai', 
//         text: res.data.answer,
//         visual: res.data.visual,
//         followUp: res.data.followUp,
//         audio: res.data.audio
//       };
      
//       setMessages(prev => [...prev, aiMsg]);
      
//       // Convert base64 audio to Uint8Array
//       const audioData = Uint8Array.from(atob(res.data.audio), c => c.charCodeAt(0));
//       speak(audioData);
//     } catch (err) {
//       setMessages(prev => [...prev, { role: 'ai', text: "Oops! Something went wrong. Please try again!" }]);
//     }

//     setLoading(false);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       sendQuestion();
//     }
//   };

//   return (
//     <div className="chat-container">
//       <Avatar speaking={isSpeaking} />
//       <div className="chat-window">
//         {messages.map((msg, idx) => (
//           <Message 
//             key={idx} 
//             role={msg.role} 
//             text={msg.text} 
//             visual={msg.visual}
//             followUp={msg.followUp}
//           />
//         ))}
//         {loading && <Message role="ai" text="Let me think about that... 🤔" />}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="input-box">
//         <input
//           type="text"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Ask a math question..."
//           disabled={loading}
//         />
//         <button onClick={sendQuestion} disabled={loading}>
//           {loading ? '...' : 'Ask'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;
// frontend/src/components/ChatBox.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import Avatar from './Avatar';
import './ChatBox.css';
import BASE_URL from '../backend';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true); // Track audio availability
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (audioData) => {
    if (!audioData || !audioAvailable) return;
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onended = () => setIsSpeaking(false);
      audioRef.current.onerror = () => {
        console.error('Audio playback failed');
        setAudioAvailable(false);
        setIsSpeaking(false);
      };
      
      audioRef.current.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioAvailable(false);
    }
  };

  const sendQuestion = async () => {
    if (!question.trim() || loading) return;

    const userMsg = { role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/ai/ask`, { question });
      const aiMsg = { 
        role: 'ai', 
        text: res.data.answer,
        visual: res.data.visual,
        followUp: res.data.followUp,
        audio: res.data.audio
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      if (res.data.audio) {
        try {
          const audioData = Uint8Array.from(atob(res.data.audio), c => c.charCodeAt(0));
          speak(audioData);
        } catch (audioError) {
          console.error('Audio processing failed:', audioError);
          setAudioAvailable(false);
        }
      } else {
        setAudioAvailable(false);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Oops! Something went wrong. Please try again!" 
      }]);
      setAudioAvailable(false);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendQuestion();
    }
  };

  return (
    <div className="chat-container">
      <Avatar speaking={isSpeaking && audioAvailable} />
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <Message 
            key={idx} 
            role={msg.role} 
            text={msg.text} 
            visual={msg.visual}
            followUp={msg.followUp}
          />
        ))}
        {loading && <Message role="ai" text="Let me think about that... 🤔" />}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-box">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a math question..."
          disabled={loading}
        />
        <button onClick={sendQuestion} disabled={loading}>
          {loading ? '...' : 'Ask'}
        </button>
      </div>
      {!audioAvailable && (
        <div className="audio-warning">
          Note: Audio is currently unavailable, but you can still chat!
        </div>
      )}
    </div>
  );
};

export default ChatBox;