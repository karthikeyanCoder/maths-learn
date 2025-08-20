
// // frontend/src/components/Avatar.js
// import React from 'react';
// import avatarImg from '../assets/cropped.png';
// import speakingGif from '../assets/avatar-speaking.gif';

// const Avatar = ({ speaking }) => {
//   return (
//     <div className="avatar">
//       <img 
//         src={speaking ? speakingGif : avatarImg} 
//         alt="AI Tutor" 
//         className={speaking ? 'speaking' : ''}
//       />
//     </div>
//   );
// };

// export default Avatar;
// frontend/src/components/Avatar.js
import React from 'react';
import avatarImg from '../assets/cropped.png';
import speakingGif from '../assets/avatar-speaking.gif';

const Avatar = ({ speaking }) => {
  return (
    <div className="avatar">
      <img 
        src={speaking ? speakingGif : avatarImg} 
        alt="AI Tutor" 
        className={speaking ? 'speaking' : ''}
      />
      {speaking && <div className="speaking-indicator">🔊</div>}
    </div>
  );
};

export default Avatar;