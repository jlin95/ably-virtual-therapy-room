"use client";

import React, { useEffect, useState } from "react";

import { useChannel } from "ably/react";
import styles from "./ChatBox.module.css";
import {
  SpaceProvider,
  SpacesProvider,
  useMembers,
} from "@ably/spaces/dist/mjs/react";
import Image from "next/image";

const ChatBox = ({ user, space, ablyClient }) => {
  // Message handling
  let inputBox = null;
  let messageEnd = null;

  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState([]);
  const [presentMembers, setPresentMembers] = useState([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const { channel, ably } = useChannel("therapy-room-chat", (message) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  if (space) {
    space.enter({
      username: user,
      avatar: "https://picsum.photos/id/1/200/300",
    });
  }

  useEffect(() => {
    if (space) {
      space.subscribe("update", (spaceState) => {
        const presentMembers = spaceState.members;
        setPresentMembers(presentMembers);
      });
    }
  }, [space]);

  const sendChatMessage = (messageText) => {
    channel.publish({
      name: "chat-message",
      data: {
        messageText,
        senderUsername: user,
      },
    });
    setMessageText("");
    inputBox.focus();
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const messages = receivedMessages.map((message, index) => {
    console.log(presentMembers);
    const author = message.connectionId === ably.connection.id ? "me" : "other";
    const userData = presentMembers.filter(
      (member) => member.connectionId === message.connectionId
    );
    return (
      <div key={index}>
        <img
          src={userData.profileData?.avatar}
          alt={userData.profileData?.username}
          height={20}
          width={20}
        />
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
    <SpacesProvider client={ablyClient}>
      <SpaceProvider name="therapy-space">
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
      </SpaceProvider>
    </SpacesProvider>
  );
};

export default ChatBox;
