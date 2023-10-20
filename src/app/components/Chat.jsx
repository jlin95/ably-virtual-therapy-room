"use client";

import * as Ably from "ably";
import { AblyProvider } from "ably/react";
import ChatBox from "./Chatbox";

const ChatContainer = () => {
  const client = new Ably.Realtime.Promise({ authUrl: "/api" });

  return (
    <AblyProvider client={client}>
      <ChatBox />
    </AblyProvider>
  );
};

export default ChatContainer;
