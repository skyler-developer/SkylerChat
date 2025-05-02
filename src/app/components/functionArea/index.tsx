import React from "react";
import { Button } from "antd";
import styles from "./index.module.css";
export default function FunctionArea() {
  return (
    <div>
      <div className={styles.buttonContainer}>
        <Button className={styles.button}>新对话</Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button className={styles.button}>智能体</Button>
      </div>
      <div className={styles.horizontalLine} />
      <div className={styles.buttonContainer}>
        <Button className={styles.button}>最近对话</Button>
      </div>
    </div>
  );
}
