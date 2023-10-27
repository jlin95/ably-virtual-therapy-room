"use client";

import * as Ably from "ably";
import { useEffect, useState } from "react";
import { AblyProvider } from "ably/react";
import Spaces from "@ably/spaces";

import ChatBox from "./Chatbox";
import UsernamePrompt from "./UsernamePrompt";

const MeetingRoom = () => {
  const client = new Ably.Realtime.Promise({
    authUrl: "/api",
    key: process.env.ABLY_API_KEY,
    clientId: "therapy-room",
  });

  const spaces = new Spaces(client);

  const getSpaceUponEnter = async () => {
    const space = await spaces.get("therapy-space");
    setCurrentSpace(space);
  };

  const [currentSpace, setCurrentSpace] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");
  const savedUsername = localStorage.getItem("username");

  useEffect(() => {
    let username = localStorage.getItem("username") || "";
    setCurrentUsername(username);
  }, []);

  useEffect(() => {
    getSpaceUponEnter();
  }, []);

  const saveUsername = () => {
    localStorage.setItem("username", currentUsername);
    window.location.reload();
  };

  const handleUsernameKeyPress = (event) => {
    if (event.charCode !== 13 || currentUsername.trim().length === 0) {
      return;
    }
    saveUsername();
    event.preventDefault();
  };

  return (
    <AblyProvider client={client}>
      {!savedUsername ? (
        <span>
          <UsernamePrompt
            handleOnChange={(e) => setCurrentUsername(e.target.value)}
            isButtonDisabled={currentUsername.trim().length === 0}
            handleSave={saveUsername}
            handleOnKeyPress={handleUsernameKeyPress}
          />
          <select>
            <option>Therapist</option>
            <option>client</option>
          </select>
        </span>
      ) : (
        <ChatBox
          user={savedUsername}
          space={currentSpace}
          ablyClient={client}
        />
      )}
    </AblyProvider>
  );
};

// initite symptom checker before going to chat room with therapist

export default MeetingRoom;
