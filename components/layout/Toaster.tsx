import { NotifyType } from "../../utils/context/SettingsContext";
import styles from "./Layout.module.scss";

interface ToasterProps {
  cancel: () => void;
  toasterParams: { message?: string; type?: NotifyType };
  visible: boolean;
}

export const Toaster = (props: ToasterProps) => {
  const { visible, toasterParams, cancel } = props;
  const { type, message } = toasterParams;

  const iconsMap = {
    success: "/icons/check.svg",
    error: "/icons/cancel.svg",
    info: "/icons/blue-info.svg"
  };

  return (
    <div
      className={[
        styles.toaster,
        styles[type ?? "success"],
        visible && styles.active
      ].join(" ")}
    >
      <div className={styles["icon-wrapper"]}>
        <img
          alt="notify"
          className={styles.icon}
          src={iconsMap[type ?? "success"]}
        />
      </div>
      <span className={styles.message}>{message}</span>
      <div onClick={cancel} className={styles["close-icon"]}>
        <div className={styles.bar} />
        <div className={styles.bar} />
      </div>
    </div>
  );
};
