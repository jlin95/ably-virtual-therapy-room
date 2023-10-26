import Head from "next/head";
import dynamic from "next/dynamic";

const MeetingRoom = dynamic(() => import("./components/MeetingRoom.jsx"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Virtual Therapy Hangout</title>
        <link
          rel="icon"
          href="https://static.ably.dev/motif-red.svg?nextjs-vercel"
          type="image/svg+xml"
        />
      </Head>
      <main>
        <h1 className="title">Chat Room</h1>
        <MeetingRoom />
      </main>
    </div>
  );
}
