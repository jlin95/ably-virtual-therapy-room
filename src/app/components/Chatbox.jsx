"use client";

import React, { useEffect, useState } from "react";
import { useChannel } from "ably/react";
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

  const handleUsernameKeyPress = (event) => {
    if (event.charCode !== 13 || username.trim().length === 0) {
      return;
    }
    setUsername("");
    event.preventDefault();
  };

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";

    return (
      <div key={index}>
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
      <textarea
        ref={(element) => {
          inputBox = element;
        }}
        placeholder="Type your username..."
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleUsernameKeyPress}
      ></textarea>
      <form onSubmit={handleFormSubmission} className={styles.form}>
        <textarea
          ref={(element) => {
            inputBox = element;
          }}
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          className={styles.textarea}
        ></textarea>
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
