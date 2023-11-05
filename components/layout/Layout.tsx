import React, { FunctionComponent, ReactNode, useContext } from "react";
import styles from "./Layout.module.scss";
import { useRouter } from "next/router";
import useDeviceType from "../../utils/hooks/useDeviceType";
import CurrencyController from "./CurrencyController";
import Footer from "./Footer";
import Header from "./Header";
import CheckoutHeader from "./CheckoutHeader";
import AuthModal from "./AuthModal";
import SettingsContext from "../../utils/context/SettingsContext";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { pathname: _pathname } = useRouter();
  const pathname = _pathname.split("/")[1];
  const deviceType = useDeviceType();

  const { shouldShowAuthDropdown, setShouldShowAuthDropdown } = useContext(
    SettingsContext
  );

  return (
    <>
      <AuthModal
        visible={shouldShowAuthDropdown}
        cancel={() => setShouldShowAuthDropdown(false)}
      />
      {pathname === "checkout" && deviceType === "desktop" ? (
        <CheckoutHeader />
      ) : (
        <Header />
      )}
      <main className={styles.main}>
        <CurrencyController />
        {children}
        {pathname !== "checkout" && <Footer />}
      </main>
    </>
  );
};

export default Layout;
