import React from "react";
import styles from "./index.module.css";
import InputArea from "./inputArea";
import QaArea from "./qaArea";
export default function ChatArea() {
  return (
    <div className={styles.chatArea}>
      <QaArea />
      <InputArea />
    </div>
  );
}
