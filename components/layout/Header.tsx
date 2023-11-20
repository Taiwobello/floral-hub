import {
  FunctionComponent,
  useContext,
  useState,
  MouseEvent as ReactMouseEvent,
  useMemo,
  useEffect
} from "react";
import Link from "next/link";
import SettingsContext from "../../utils/context/SettingsContext";
import { useRouter } from "next/router";
import useDeviceType from "../../utils/hooks/useDeviceType";
import AppStorage from "../../utils/helpers/storage-helpers";
import Button from "../button/Button";
import styles from "./Layout.module.scss";
import { links } from "../../utils/constants";
import ContextWrapper from "../context-wrapper/ContextWrapper";
import FlowerCard from "../flower-card/FlowerCard";
import { AppLink } from "../../utils/types/Core";
import { getProductsBySlugs } from "../../utils/helpers/data/products";
import useOutsideClick from "../../utils/hooks/useOutsideClick";
import SearchDropdown from "./SearchDropdown";
import useScrollCheck from "../../utils/hooks/useScrollCheck";

const Header: FunctionComponent = () => {
  const [activeNavLink, setActiveNavLink] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSublinkNav, setActiveSublinkNav] = useState("");

  const [linksWithFeaturedProducts, setLinksWithFeaturedProducts] = useState<
    AppLink[]
  >([...links]);
  const [displaySearchDropdown, setDisplaySearchDropdown] = useState(false);

  const deviceType = useDeviceType();

  const { pathname: _pathname, query } = useRouter();
  const pathname = _pathname.split("/").pop();

  const {
    cartItems,
    user,
    setShouldShowCart,
    shouldShowCart,
    setOrder,
    setCurrentStage,
    orderId,
    setDeliveryDate,
    setSearchText,
    setUser,
    notify,
    setShouldShowAuthDropdown
  } = useContext(SettingsContext);

  const searchDropdownRef = useOutsideClick<HTMLDivElement>(() => {
    setDisplaySearchDropdown(false);
  });

  const totalCartItems = useMemo(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const handleActiveNav = (title: string, e: ReactMouseEvent) => {
    setActiveNavLink(title);
    e.stopPropagation();
  };

  const hasScrolled = useScrollCheck();

  useEffect(() => {
    if (!orderId && pathname !== "checkout") {
      setOrder(null);
      setCurrentStage(1);
      setDeliveryDate(null);
    }

    if (!query.search) {
      setSearchText("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const { error, message, data } = await getProductsBySlugs(
        links
          .map(link => link.featuredSlugs)
          .flat()
          .filter(Boolean) as string[]
      );
      if (error) {
        notify("error", `Unable to fetch featured products: ${message}`);
        return;
      }
      setLinksWithFeaturedProducts(
        links.map(link => ({
          ...link,
          featuredProducts: data?.filter(product =>
            link.featuredSlugs?.includes(product.slug)
          )
        }))
      );
    };

    fetchFeaturedProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisplayAuthModal = () => {
    if (!user) setShouldShowAuthDropdown(true);
  };

  const handleLogout = async () => {
    AppStorage.remove("userData");
    setUser(null);
  };

  const accountAnchor = (
    <Button onClick={handleDisplayAuthModal} type="plain">
      {user ? (
        <span className={[styles.initial, styles["control-icon"]].join(" ")}>
          {(user.name || user.email)[0]}
        </span>
      ) : (
        <span className="flex spaced center-align">
          <span>Login/Register</span>
          <img
            alt="user"
            src="/icons/user.svg"
            className={styles["control-icon"]}
          />
        </span>
      )}
    </Button>
  );

  return (
    <>
      <header className={styles.header} id="top">
        <img
          alt="menu"
          src={`${
            showSidebar ? "/icons/cancel-menu.svg" : "/icons/hamburger-menu.svg"
          }`}
          className={styles["hamburger-menu"]}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        {deviceType === "mobile" && (
          <nav
            className={[
              styles["mobile-sidebar"],
              showSidebar && styles.active
            ].join(" ")}
          >
            {links.map((link, index) => (
              <div className={styles.link} key={index}>
                {link.url ? (
                  <Link href={link.url} key={link.title}>
                    <a
                      className={`flex center-align spaced ${styles.title}`}
                      onClick={() => {
                        setActiveNavLink(link.title);
                        !link.children.length && setShowSidebar(false);
                      }}
                    >
                      <strong>{link.title}</strong>
                      {link.children.length > 0 && (
                        <div className={[styles.arrow].join(" ")}></div>
                      )}
                    </a>
                  </Link>
                ) : (
                  <div
                    className={`flex center-align spaced ${styles.title}`}
                    onClick={() => {
                      setActiveNavLink(link.title);
                      !link.children.length && setShowSidebar(false);
                    }}
                    key={link.title}
                  >
                    <strong>{link.title}</strong>
                    {link.children.length > 0 && (
                      <div className={[styles.arrow].join(" ")}></div>
                    )}
                  </div>
                )}

                <div>
                  {link.children.length > 0 && (
                    <div
                      className={[
                        styles["sub-link"],
                        activeNavLink === link.title && styles.active
                      ].join(" ")}
                    >
                      <div
                        className={styles.back}
                        onClick={() => {
                          setActiveNavLink("");
                          setShowSidebar(true);
                        }}
                      >
                        <div className={styles["back-arrow"]}></div>
                        Back
                      </div>

                      {link.children.map((child, index) => (
                        <div key={index}>
                          {child.url ? (
                            <Link href={child.url} key={index}>
                              <a
                                className={styles["sub-link-title"]}
                                onClick={() => {
                                  setActiveNavLink("");
                                  setShowSidebar(false);
                                  setActiveSublinkNav("");
                                }}
                              >
                                {child.title && <p>{child.title}</p>}
                              </a>
                            </Link>
                          ) : (
                            <div
                              className={styles["sub-link-title"]}
                              onClick={() => {
                                setActiveSublinkNav(child.title);
                              }}
                              key={index}
                            >
                              <strong>{child.title}</strong>
                              {child.children.length > 0 && (
                                <div className={[styles.arrow].join(" ")}></div>
                              )}
                            </div>
                          )}
                          <div
                            className={[
                              styles["sub-child"],
                              activeSublinkNav === child.title && styles.active
                            ].join(" ")}
                          >
                            <div
                              className={styles.back}
                              onClick={() => {
                                setActiveNavLink(link.title);
                                setActiveSublinkNav("");
                              }}
                            >
                              <div className={styles["back-arrow"]}></div>
                              Back
                            </div>
                            {child.children.map((subChild, index) => (
                              <Link href={subChild.url} key={index}>
                                <a
                                  className={styles["sub-link-title"]}
                                  onClick={() => {
                                    setActiveNavLink("");
                                    setShowSidebar(false);
                                    setActiveSublinkNav("");
                                  }}
                                >
                                  {subChild.title && <p>{subChild.title}</p>}
                                </a>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>
        )}
        <div
          className={[styles["logo-flex"], hasScrolled && styles.minimize].join(
            " "
          )}
        >
          <span
            className={[
              "flex spaced center-align larger",
              styles.packaged
            ].join(" ")}
          >
            <img
              alt="love"
              src="/icons/hearts.svg"
              className="generic-icon medium"
            />
            <span>Packaged and hand delivered with love.</span>
          </span>
          <Link href="/">
            <a>
              <img
                alt="regal flowers logo"
                src="/icons/logo.png"
                className={styles.logo}
                onClick={() => setShowSidebar(false)}
              />
            </a>
          </Link>
          <nav className={styles.nav}>
            {linksWithFeaturedProducts.map((link, index) => (
              <div
                className={styles.link}
                key={index}
                onMouseEnter={e => handleActiveNav(link.title, e)}
                onMouseLeave={() => setActiveNavLink("")}
              >
                <Button
                  className={`flex center-align spaced  ${
                    styles.title
                  } ${activeNavLink === link.title && styles.active}`}
                  key={link.title}
                  type="plain"
                  url={link.url}
                >
                  {link.title}
                </Button>
                {link.children.length > 0 && (
                  <div
                    className={[
                      styles.dropdown,
                      activeNavLink === link.title && styles.active,
                      hasScrolled && styles.minimize
                    ].join(" ")}
                  >
                    <div className="flex between">
                      <div
                        className={[
                          styles["sub-link"],
                          link.children.some(child => child.children.length) &&
                            styles.grid
                        ].join(" ")}
                      >
                        {link.children.map((child, index) => (
                          <div key={index}>
                            {child.url ? (
                              <Link href={child.url}>
                                <a
                                  onClick={() => {
                                    setActiveNavLink("");
                                  }}
                                >
                                  {child.title && (
                                    <span
                                      className={[
                                        child.children.length && styles.title
                                      ].join(" ")}
                                    >
                                      {child.title}
                                    </span>
                                  )}
                                </a>
                              </Link>
                            ) : (
                              <>
                                {child.title && (
                                  <span
                                    className={[
                                      child.children.length && styles.title
                                    ].join(" ")}
                                  >
                                    {child.title}
                                  </span>
                                )}
                              </>
                            )}
                            <div className={styles["grand-children"]}>
                              {child.children.map((grandChild, index) => (
                                <Link href={grandChild.url} key={index}>
                                  <a
                                    className={styles["grand-title"]}
                                    onClick={() => {
                                      setActiveNavLink("");
                                    }}
                                  >
                                    {grandChild.title}
                                  </a>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className={styles["card-wrapper"]}
                        style={{
                          width: `${(link.featuredProducts?.length || 0 + 1) *
                            15}rem`
                        }}
                      >
                        <h3 className="thin margin-bottom">
                          FEATURED PRODUCT
                          {link.featuredProducts?.length !== 1 ? "S" : ""}
                        </h3>
                        <div className="flex spaced full-width">
                          {link.featuredProducts?.map((product, i) => (
                            <FlowerCard
                              name={product.name}
                              key={i}
                              subTitle={product.subtitle}
                              image={product.images[0]?.src}
                              url={`/product/${product.slug}`}
                              price={product.price}
                              product={product}
                              style={{ width: "14rem" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* <div className="flex spaced center-align">
          
          <div
            className={[
              styles["search-wrapper"],
              displaySearchDropdown ? styles.active : ""
            ].join(" ")}
          >
            <form
              className={[
                styles["search-form"],
                displaySearchDropdown ? styles.active : ""
              ].join(" ")}
              onSubmit={handleSearch}
              onClick={() => {
                setDisplaySearchDropdown(true);
                searchInputRef.current?.focus();
              }}
            >
              <input
                type="text"
                onChange={e => {
                  setSearchText(e.target.value);
                }}
                placeholder="Search for products"
                value={searchText}
                className={[
                  styles["search-input"],
                  displaySearchDropdown ? styles.active : ""
                ].join(" ")}
                ref={searchInputRef}
              />
            </form>
            {displaySearchDropdown ? (
              <img
                alt="search"
                src="/icons/search-cancel.svg"
                className={`${styles["search-icon"]} generic-icon medium clickable`}
                onClick={() => {
                  setDisplaySearchDropdown(false);
                }}
              />
            ) : (
              <img
                alt="search"
                src="/icons/search.svg"
                className={`${styles["search-icon"]} generic-icon medium clickable`}
                onClick={() => {
                  setDisplaySearchDropdown(true);
                  searchInputRef.current?.focus();
                }}
              />
            )}
          </div>
        </div> */}

        <div
          className={[styles["controls-area-mobile"], "flex spaced-lg"].join(
            " "
          )}
        >
          <ContextWrapper
            anchor={accountAnchor}
            className={styles["auth-wrapper"]}
          >
            {user ? (
              <div className={styles["user-area"]}>
                <div className="flex column center-align">
                  <em className="margin-bottom spaced">
                    Logged in as {user.email}
                  </em>
                  <Button onClick={handleLogout}>Logout</Button>
                </div>
              </div>
            ) : (
              ""
            )}
          </ContextWrapper>

          <button
            className={[styles["cart-btn"]].join(" ")}
            onClick={() => {
              setShouldShowCart(!shouldShowCart);
            }}
          >
            <svg
              width="29"
              height="24"
              viewBox="0 0 24 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles["control-icon"]}
            >
              <path
                d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className={styles["items-count"]}>{totalCartItems}</span>
          </button>
        </div>
        <div className={styles["controls-area"]}>
          <div className="flex spaced-lg center-align">
            <div ref={searchDropdownRef}>
              <Button
                className="flex column center-align"
                type="plain"
                onClick={() => setDisplaySearchDropdown(!displaySearchDropdown)}
              >
                <img
                  alt="search"
                  src={
                    displaySearchDropdown
                      ? "/icons/search-cancel.svg"
                      : "/icons/search.svg"
                  }
                  className={styles["control-icon"]}
                />
              </Button>

              <SearchDropdown
                visible={displaySearchDropdown}
                cancel={() => setDisplaySearchDropdown(false)}
                hasScrolled={hasScrolled}
              />
            </div>
            <Link href={"/cart"}>
              <Button className={[styles["cart-button"]].join(" ")} type="plain">
                <img
                  alt="cart"
                  src="/icons/cart.svg"
                  className={styles["control-icon"]}
                />
                {cartItems.length > 0 && (
                  <span className={styles["items-count"]}>
                    {cartItems.length > 9 ? "9+" : cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
            <ContextWrapper
              anchor={accountAnchor}
              className={styles["auth-wrapper"]}
            >
              {user ? (
                <div className={styles["user-area"]}>
                  <div className="flex column center-align">
                    <em className="margin-bottom spaced">
                      Logged in as {user.email}
                    </em>
                    <Button onClick={handleLogout}>Logout</Button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </ContextWrapper>
          </div>
        </div>
      </header>
      {/* <AuthModal
        visible={showAuthModal}
        cancel={() => setShowAuthModal(false)}
      /> */}
    </>
  );
};

export default Header;
