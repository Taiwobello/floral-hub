import Link from "next/link";
import Img from "next/image";
import React, {
  CSSProperties,
  forwardRef,
  MouseEvent,
  useContext,useState
} from "react";
import SettingsContext from "../../utils/context/SettingsContext";
import { getPriceDisplay } from "../../utils/helpers/type-conversions";
import { CartItem } from "../../utils/types/Core";
import Product, { ProductImage } from "../../utils/types/Product";
import Button from "../button/Button";
import styles from "./FlowerCard.module.scss";
import useDeviceType from "../../utils/hooks/useDeviceType";
import { getMobileImageUrl } from "../../utils/helpers/formatters";

interface IFlowerCardProps {
  buttonText?: string;
  image?: string;
  price?: number;
  name: string;
  subTitle?: string;
  url: string;
  isAddonGroup?: boolean;
  mode?: "four-x-grid" | "three-x-grid" | "six-x-grid" | "two-x-grid";
  product?: Product;
  cart?: boolean;
  onlyTitle?: boolean;
  className?: string;
  style?: CSSProperties;
  slideImages?: ProductImage[]
}

const FlowerCard = forwardRef<HTMLAnchorElement, IFlowerCardProps>(
  (props, ref) => {
    const {
      buttonText,
      image: _image,
      price,
      name,
      subTitle,
      url,
      mode,
      product,
      cart,
      onlyTitle,
      className,
      style,
      slideImages
    } = props;

    const {
      cartItems,
      setCartItems,
      notify,
      currency,
      shouldShowCart,
      setShouldShowCart
    } = useContext(SettingsContext);
     const [imageIndex, setImageIndex] = useState(0);

     const image = slideImages?.[imageIndex].src || _image || ""

     const nextImage = () =>{
       if (slideImages && slideImages.length > 1) {
        setImageIndex(1)
       }
 
     }

    const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!product) {
        return;
      }
      
      const cartItem: CartItem = {
        key: product.key,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: {
          src: product.images[0].src,
          alt: product.images[0].alt
        },
        SKU: product.sku
      };

      const _cartItem = cartItems.find(item => item.key === product?.key);

      if (!_cartItem) {
        setCartItems([...cartItems, cartItem]);
        notify(
          "success",
          <p>
            Item Added To Cart{" "}
            <span
              className="view-cart"
              onClick={() => setShouldShowCart(!shouldShowCart)}
            >
              View Cart
            </span>
          </p>
        );
      } else {
        const _cartItems = cartItems.map(item => {
          if (item.key === product.key) {
            item.quantity += 1;
          }
          return item;
        });
        setCartItems(_cartItems);
        notify(
          "success",
          <p>
            Item Added To Cart{" "}
            <span
              className="view-cart"
              onClick={() => setShouldShowCart(!shouldShowCart)}
            >
              View Cart
            </span>
          </p>
        );
      }
      e.stopPropagation();
    };
     
    const outOfStock = product && !product.sku && !product.variants.length;

    const deviceType = useDeviceType();

    return (
      <Link href={url || "#"}>
        <a
          className={`${styles["flower-card"]} center ${
            styles[mode || "four-x-grid"]
          }`}
          ref={ref}
        >
          <div className={styles["img-wrapper"]} onMouseEnter={nextImage} onMouseLeave={()=> setImageIndex(0)}>
            <Img
              className={styles["flower-image"]}
              src={deviceType === "mobile" ? getMobileImageUrl(image) : image}
              height={deviceType === "mobile" ? 800 : 2500}
              width={deviceType === "mobile" ? 800 : 2500}
              alt="featured flower"

            />
          </div>
          <div className={styles.detail}>
            <span
              className={[
                styles.name,
                onlyTitle && styles["only-name"],
                "semibold"
              ].join(" ")}
            >
              {name}
            </span>
            <p className={styles.subtitle}>{subTitle}</p>
            {!onlyTitle && (
              <div
                className={` ${price ? "between" : ""} ${
                  styles["price-btn-wrapper"]
                } ${price ? styles.price : ""}`}
              >
                {price && (
                  <>
                    <div
                      className={`flex spaced ${styles["price-text"]} semibold center-align`}
                    >
                      {(product?.variants.length || 0) > 0 && (
                        <p className="text-secondary">FROM</p>
                      )}
                      <span>{getPriceDisplay(price, currency)}</span>
                    </div>
                    <button
                      className={`${styles["buy-btn"]} text-small semibold`}
                      onClick={e => cart && handleAddToCart(e)}
                      disabled={outOfStock}
                    >
                      {deviceType === "mobile" ? (
                        "ADD TO CART"
                      ) : (
                        <>
                          <img src="/icons/add-box-line.svg" alt="" />{" "}
                          <p>ADD TO CART</p>
                        </>
                      )}
                    </button>
                  </>
                )}
                {!price && (
                  <Button
                    className={`${styles["gift-btn"]}`}
                    onClick={e => cart && handleAddToCart(e)}
                    disabled={outOfStock}
                  >
                    {outOfStock
                      ? "Out of Stock"
                      : buttonText
                      ? buttonText
                      : "Buy Now"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </a>
      </Link>
    );
  }
);

export default FlowerCard;
