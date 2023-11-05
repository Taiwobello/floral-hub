import React, { FunctionComponent, ReactNode } from "react";
import styles from "./Layout.module.scss";
import { useRouter } from "next/router";
import useDeviceType from "../../utils/hooks/useDeviceType";
import CurrencyController from "./CurrencyController";
import Footer from "./Footer";
import Header from "./Header";
import CheckoutHeader from "./CheckoutHeader";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { pathname: _pathname } = useRouter();
  const pathname = _pathname.split("/")[1];
  const deviceType = useDeviceType();

  return (
    <>
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
