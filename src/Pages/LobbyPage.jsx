import React from 'react';

const LobbyPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const inviteCode = event.target.invite_link.value;

    // Redirect to the non-React index.html with room parameter
    window.location.href = `videochat.html?room=${inviteCode}`;
  };

  return (
    <div id="lobby-container">
      <div id="form-container">
        <div id="form__container__header">
          <p>👋 Create OR Join a Room</p>
        </div>
        <div id="form__content__wrapper">
          <form id="join-form" onSubmit={handleSubmit}>
            <input type="text" name="invite_link" required placeholder="Enter Room ID" />
            <button type="submit">Join Room</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
