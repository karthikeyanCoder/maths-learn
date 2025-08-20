// import React from 'react';

// const Message = ({ role, text }) => {
//   return (
//     <div className={`message ${role}`}>
//       <p>{text}</p>
//     </div>
//   );
// };

// export default Message;
// frontend/src/components/Message.js
import React from 'react';

const Message = ({ role, text, visual, followUp }) => {
  return (
    <div className={`message ${role}`}>
      <p>{text}</p>
      {visual && (
        <div className="visual">
          <pre>{visual}</pre>
        </div>
      )}
      {followUp && role === 'ai' && (
        <div className="follow-up">
          <p>Try asking: <em>{followUp}</em></p>
        </div>
      )}
    </div>
  );
};

export default Message;