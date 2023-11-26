import { FormEvent, FunctionComponent, useContext } from "react";
import styles from "./Layout.module.scss";
import SettingsContext from "../../utils/context/SettingsContext";
import { useRouter } from "next/router";
import Button from "../button/Button";
import { giftItems } from "../../utils/constants";
import FlowerCard from "../flower-card/FlowerCard";

interface Props {
  visible: boolean;
  hasScrolled: boolean;
  cancel: () => void;
}

const SearchDropdown: FunctionComponent<Props> = props => {
  const { visible, hasScrolled, cancel } = props;

  const { searchText, setSearchText } = useContext(SettingsContext);

  const { push } = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (searchText) {
      push(`/filters?search=${searchText}`, undefined, { scroll: false });
      cancel();
    } else {
      push("/product-category/anniversary-flowers", undefined, {
        scroll: false
      });
    }
  };
  return (
    <div
      className={[
        styles["search-dropdown"],
        visible && styles.active,
        hasScrolled && styles.minimize
      ].join(" ")}
    >
      <form className={styles["search-form"]} onSubmit={handleSearch}>
        <img
          alt="search"
          src="/icons/search.svg"
          className={`${styles["search-icon"]} generic-icon medium clickable`}
        />
        <input
          type="text"
          onChange={e => {
            setSearchText(e.target.value);
          }}
          placeholder="Search keyword or category"
          value={searchText}
          className={styles["search-input"]}
        />
        <img
          alt="search"
          src="/icons/search-cancel.svg"
          className={`${styles["search-icon"]} generic-icon medium clickable`}
          onClick={() => {
            setSearchText("");
          }}
        />
      </form>
      <div className="flex between center-align">
        <p className="text-regular">BEST SELLING PRODUCT</p>
        <Button
          url="/product-category/anniversary-flowers"
          className="flex spaced center-align primary-color"
          type="transparent"
        >
          See All
        </Button>
      </div>
      <div className={[styles["featured-product"]].join(" ")}>
        {giftItems.map(gift => (
          <FlowerCard
            key={gift.name}
            image={gift.image}
            name={gift.name}
            subTitle={gift.description}
            url={gift.slug}
            buttonText="See More"
          />
        ))}
      </div>
    </div>
  );
};

export default SearchDropdown;
