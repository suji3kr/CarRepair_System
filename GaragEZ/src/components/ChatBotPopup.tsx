import React from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatBot from "../pages/ChatBot";
import { useChatBot } from "../context/ChatBotContext";

const ChatBotPopup: React.FC = () => {
  const { isChatOpen, closeChat } = useChatBot();

  return (
    <Dialog
      open={isChatOpen}
      onClose={closeChat}
      hideBackdrop
      disablePortal
      sx={{
        "& .MuiDialog-container": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        "& .MuiPaper-root": {
          width: "380px", // 기본 너비
          height: "550px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          background: "#e4e9eb",
          margin: 0,
          position: "fixed",
          bottom: "20px",
          right: "20px",
          transform: "none !important",
          // 반응형: 화면 크기가 400px 이하일 때 width를 340px로 변경
          "@media (max-width: 480px)": {
            width: "340px",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          padding: "0 !important",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          WebkitOverflowScrolling: "touch",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={closeChat}
          sx={{
            position: "absolute",
            right: "3px",
            zIndex: 1100,
            color: "#000",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <ChatBot />
      </DialogContent>
    </Dialog>
  );
};

export default ChatBotPopup;