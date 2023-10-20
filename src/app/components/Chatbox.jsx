"use client";

import React, { useEffect, useState } from "react";
import { useChannel } from "ably/react";
import { SpaceMember, Space } from "@ably/spaces";
import styles from "./ChatBox.module.css";

export default function ChatBox() {
  let inputBox = null;
  let messageEnd = null;

  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const messageTextIsEmpty = messageText.trim().length === 0;

  const { channel, ably } = useChannel("therapy-room-chat", (message) => {
    const history = receivedMessages.slice(-199);
    console.log(history);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText) => {
    channel.publish({
      name: "chat-message",
      data: {
        messageText,
        senderUsername: username,
      },
    });
    setMessageText("");
    inputBox.focus();
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyPress = (event) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  };

  const handleUsernameKeyPress = (event) => {
    if (event.charCode !== 13 || username.trim().length === 0) {
      return;
    }
    setUsername(username);
  };

  const handleUsernameSubmission = (event) => {
    // event.preventDefault();
    setUsername(event.target.value);
  };

  const renderUsernameInput = () => (
    <textarea
      ref={(element) => {
        inputBox = element;
      }}
      value={username}
      placeholder="Type your username..."
      onChange={(e) => setUsername(e.target.value)}
      onKeyPress={handleUsernameKeyPress}
    ></textarea>
  );

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";

    return (
      // eslint-disable-next-line react/jsx-key
      <div>
        <span>{message.data.senderUsername}</span>
        <span className={styles.message} data-author={author}>
          {message.data.messageText}
        </span>
      </div>
    );
  });

  useEffect(() => {
    messageEnd.scrollIntoView({ behaviour: "smooth" });
  });

  const showUsernameInput = receivedMessages.some((message) => {
    return message.connectionId === ably.connection.id ? "me" : "other";
  });

  return (
    <div className={styles.chatHolder}>
      <div className={styles.chatText}>
        {messages}
        <div
          ref={(element) => {
            messageEnd = element;
          }}
        ></div>
      </div>
      <form onSubmit={handleFormSubmission} className={styles.form}>
        <textarea
          ref={(element) => {
            inputBox = element;
          }}
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.textarea}
        ></textarea>
        {showUsernameInput && renderUsernameInput()}
        {/* https://ably.com/tutorials/reactjs-realtime-commenting */}
        {/* https://examples.ably.dev/avatar-stack?space=say-promised-block and get basic symptoms checker to work - via queries from input and Spaces */}
        <button
          type="submit"
          className={styles.button}
          disabled={messageTextIsEmpty}
        >
          Send
        </button>
      </form>
    </div>
  );
}
