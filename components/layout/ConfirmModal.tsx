import { useState } from "react";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import styles from "./Layout.module.scss";

export interface ConfirmParams {
  title: string;
  onOk: () => void;
  body?: string;
  okText?: string;
  cancelText?: string;
  onCancel?: () => void;
}

interface ConfirmModalProps {
  cancel?: () => void;
  confirmParams: ConfirmParams;
  visible: boolean;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const [loading, setLoading] = useState(false);

  const { visible, cancel, confirmParams } = props;
  const {
    okText = "Yes",
    cancelText = "No",
    onOk = () => {},
    onCancel = () => {},
    title = "Are you sure?",
    body = "This action is irreversible"
  } = confirmParams;

  const handleClick = async () => {
    setLoading(true);
    try {
      await onOk();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    cancel?.();
  };

  const handleCancel = () => {
    onCancel();
    cancel?.();
  };

  return (
    <Modal visible={visible} isConfirm>
      <h2 className={styles["confirm-title"]}>{title}</h2>
      <p className={styles["confirm-body"]}>{body}</p>
      <div className="flex vertical-margin end">
        <Button type="accent" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button
          loading={loading}
          type="primary"
          onClick={handleClick}
          className="margin-left spaced"
        >
          {okText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
