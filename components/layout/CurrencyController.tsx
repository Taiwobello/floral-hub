import { useContext, useState } from "react";
import useDeviceType from "../../utils/hooks/useDeviceType";
import styles from "./Layout.module.scss";
import SettingsContext from "../../utils/context/SettingsContext";

const CurrencyController = () => {
  const deviceType = useDeviceType();
  const { currency, setCurrency, allCurrencies } = useContext(SettingsContext);
  const [shouldShowCurrency, setShouldShowCurrency] = useState(
    deviceType !== "mobile"
  );

  return (
    <div className={styles["currency-wrapper"]}>
      <div
        className={[
          styles["currency-controller"],
          shouldShowCurrency && styles.active,
          "cursor-pointer"
        ].join(" ")}
        onClick={() => setShouldShowCurrency(true)}
      >
        <span>{currency.sign}</span>
      </div>
      <div
        className={[
          styles.currencies,
          shouldShowCurrency && styles["show-currencies"]
        ].join(" ")}
      >
        {deviceType === "mobile" && (
          <div
            className={styles["down-arrow"]}
            onClick={() => setShouldShowCurrency(false)}
          ></div>
        )}
        {allCurrencies.map(_currency => (
          <button
            key={_currency.name}
            onClick={() => {
              setCurrency(_currency);
              if (deviceType === "mobile") {
                setShouldShowCurrency(false);
              }
            }}
            className={[
              styles.currency,
              currency.name === _currency.name && styles.active
            ].join(" ")}
          >
            <strong>
              <span>{_currency.name}</span> <span>{_currency.sign}</span>
            </strong>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CurrencyController;
