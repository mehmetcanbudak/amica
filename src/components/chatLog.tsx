import { useContext, useEffect, useRef, useState } from "react";
import FlexTextarea from "@/components/flexTextarea/flexTextarea";
import { Message } from "@/features/chat/messages";
import { IconButton } from "@/components/iconButton";
import {
  ArrowPathIcon,
} from '@heroicons/react/20/solid';
import { ChatContext } from "@/features/chat/chatContext";

export const ChatLog = ({
   messages,
}: {
  messages: Message[];
}) => {
  const { chat: bot } = useContext(ChatContext);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const handleResumeButtonClick = (num: number, newMessage: string) => {
    bot.setMessageList(messages.slice(0, num));
    bot.receiveMessageFromUser(newMessage);
  };

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "auto",
      block: "center",
    });
  }, []);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [messages]);

  return (
    <>
      <div className="absolute left-2 top-16 z-10">
        <IconButton
          iconName="24/ReloadLoop"
          label="Restart"
          isProcessing={false}
          className="bg-slate-600 hover:bg-slate-500 active:bg-slate-500 shadow-xl"
          onClick={() => {
            bot.setMessageList([]);
          }}
        ></IconButton>
      </div>

      <div className="absolute w-col-span-6 max-w-full h-[100svh] pb-16">

        <div className="max-h-full px-16 pt-20 pb-4 overflow-y-auto scroll-hidden">
          {messages.map((msg, i) => {
            return (
              <div key={i} ref={messages.length - 1 === i ? chatScrollRef : null}>
                <Chat
                  role={msg.role}
                  message={msg.content}
                  num={i}
                  onClickResumeButton={handleResumeButtonClick}
                  />

              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const Chat = ({ role, message, num, onClickResumeButton }: {
  role: string;
  message: string;
  num: number;
  onClickResumeButton: (num: number, message: string) => void;
}) => {
  const [textAreaValue, setTextAreaValue] = useState(message);

  const onClickButton = () => {
    const newMessage = textAreaValue
    onClickResumeButton(num, newMessage);
  };


  const roleColor =
    role === "assistant" ? "bg-secondary text-white " : "bg-base text-gray-700";
  const roleText = role === "assistant" ? "text-secondary" : "text-gray-600";
  const offsetX = role === "user" ? "pl-20" : "pr-20";

  return (
    <div className={`mx-auto max-w-sm my-8 ${offsetX}`}>
      <div
        className={`px-8 py-2 rounded-t-lg font-bold tracking-wider ${roleColor} flex justify-between shadow-inner`}

      >
        <div className="text-bold">
          {role === "assistant" ? "AMICA" : "YOU"}
        </div>
        <button
          className="text-right"
          onClick={onClickButton}
        >
          {role !== "assistant" && (
            <div className="ml-16 p-1 bg-yellow-50/25 border border-yellow-800/5 rounded-full">
              <ArrowPathIcon className="h-5 w-5 hover:animate-spin" aria-hidden="true" />
            </div>
          )}
        </button>
      </div>
      <div className="px-4 py-2 bg-white rounded-b-lg shadow-sm">
        <div className={`typography-16 font-M_PLUS_2 font-bold ${roleText}`}>
          {role === "assistant" ? (
            <div>{textAreaValue}</div>
          ) : (
            <FlexTextarea
              value={textAreaValue}
              onChange={setTextAreaValue}
            />
          )}
        </div>
      </div>
    </div>
  );
};
