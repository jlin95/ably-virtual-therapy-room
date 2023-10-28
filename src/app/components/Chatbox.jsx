/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";

import { useChannel } from "ably/react";
import "./ChatBox.css";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";

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
    fetchTestData(); // Handle POST of data to backend
  };

  const fetchTestData = async () => {
    const response = await fetch("/api/hello");
    const data = await response.json();
    console.log(data);
  };

  fetch;

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";
    const userData = presentMembers.filter(
      (member) => member.connectionId === message.connectionId
    );
    return (
      <div key={index}>
        <img
          src={
            userData.profileData?.avatar || "https://picsum.photos/id/1/200/300"
          }
          alt={userData.profileData?.username}
          height={20}
          width={20}
        />
        <span>{message.data.senderUsername}</span>
        <span className="message" data-author={author}>
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
        <div className="chatHolder">
          <div className="chatText">
            {messages}
            <div
              ref={(element) => {
                messageEnd = element;
              }}
            ></div>
          </div>

          <form onSubmit={handleFormSubmission} className="form">
            <textarea
              ref={(element) => {
                inputBox = element;
              }}
              value={messageText}
              placeholder="Type a message..."
              onChange={(e) => setMessageText(e.target.value)}
              className="textarea"
            ></textarea>
            <button
              type="submit"
              className="button"
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
