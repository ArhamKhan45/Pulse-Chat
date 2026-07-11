import { Show, UserButton } from "@clerk/nextjs";

const ChatPage = () => {
  return (
    <>
      <Show when="signed-in">
        <h1> Chat Signed In </h1>
        <UserButton />
      </Show>
      <Show when="signed-out">
        <h1> Chat Signed Out</h1>
      </Show>
    </>
  );
};

export default ChatPage;
