import {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
  FormEvent
} from "react";
import Button from "../components/button/Button";
import FlowerCard from "../components/flower-card/FlowerCard";
import styles from "./index.module.scss";
import {
  regalFeatures,
  regalOccasions,
  reviews,
  blogPosts,
  featuredSlugs,
  allOccasionOptions,
  giftItems,
  defaultBreadcrumb,
  regalWebsiteUrl,
  schemaProperties
} from "../utils/constants";
import ServiceCard from "../components/service-card/ServiceCard";
import OccasionCard from "../components/occasion-card/OccasionCard";
import BlogCard from "../components/blog-card/BlogCard";
import SettingsContext from "../utils/context/SettingsContext";
import Select, { PaginatedOptionsWrapper } from "../components/select/Select";
import DatePicker from "../components/date-picker/DatePicker";
import { getCategories } from "../utils/helpers/data/category";
import { FetchResourceParams } from "../utils/types/FetchResourceParams";
import { Category } from "../utils/types/Category";
import { getProductsBySlugs } from "../utils/helpers/data/products";
import Product from "../utils/types/Product";
import { LocationName, UserReview } from "../utils/types/Regal";
import { GetStaticProps } from "next";
import useDeviceType from "../utils/hooks/useDeviceType";
import Link from "next/link";
import SchemaMarkup from "../components/schema-mark-up/SchemaMarkUp";
import Meta from "../components/meta/Meta";
import Input from "../components/input/Input";
import { subscribeToNewsletter } from "../utils/helpers/data/core";
import InstagramFeed from "../components/instagram-feed/InstagramFeed";

const getReviewRender = (review: UserReview, i: number) => (
  <div key={i} className={styles.review}>
    <div className={styles.rating}>
      <div>
        {Array(review.rating)
          .fill("")
          .map((_, index) => (
            <img
              key={index}
              className="generic-icon"
              alt="star"
              src="/icons/star.svg"
            />
          ))}
        {Array(5 - review.rating)
          .fill("")
          .map((_, index) => (
            <img
              key={index}
              className="generic-icon"
              alt="star"
              src="/icons/star-white.svg"
            />
          ))}
      </div>
      <strong className={styles["review-date"]}>{review.date}</strong>
    </div>
    <strong className="vertical-margin compact">{review.user.name}</strong>
    <span className={styles.text}>“{review.text}”</span>
  </div>
);

const LandingPage: FunctionComponent<{
  locationName: LocationName;
  featuredBirthday?: Product[];
  featuredRomance?: Product[];
  featuredFlowers?: Product[];
}> = ({ featuredBirthday, locationName }) => {
  const [currentReviewPageIndex, setCurrentReviewPageIndex] = useState(0);
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [minimizedStory, setMinimizedStory] = useState(true);

  const { setBreadcrumb, notify } = useContext(SettingsContext);

  const deviceType = useDeviceType();

  const handleEmailSubscription = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    const { error, message } = await subscribeToNewsletter(subscriptionEmail);
    setIsSubscribing(false);
    if (error) {
      notify("error", `Unable to subscribe email: ${message}`);
      return;
    }
    notify("success", "Successfully subscribed to newsletter");
  };

  const reviewsPageCount = Math.ceil(reviews.general.length / 3);

  useEffect(() => {
    setBreadcrumb(defaultBreadcrumb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Meta
        title="Floral Hub | Same Day Flower Delivery Shop in Lagos and Abuja, Nigeria"
        description="Order flowers and gifts online for same-day delivery or walk in 24/7. Send flowers to celebrate someone special from the top flower shop in Lagos & Abuja, Nigeria."
        image="/images/popular-bundled.jpg"
        imageAlt="Floral Hub"
        canonicalUrl={`${regalWebsiteUrl}`}
      >
        <SchemaMarkup properties={schemaProperties} />
      </Meta>

      <section className="page-content">
        <div
          className={[styles["hero-bg"], styles[locationName], "hero-bg"].join(
            " "
          )}
        >
          <div
            className={[
              "hero-content flex column center",
              styles["hero-content"]
            ].join(" ")}
          >
            <h1 className={styles.title}>
              Send Fresh Flowers <br />
              to Lagos and Abuja, <br /> Nigeria
            </h1>
            <p className={styles.subtitle}>
              Your Favorite Online Fresh Flowers and Gifts Shop.
            </p>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <div className="flex spaced center-align">
                <span className={styles.stats}>
                  <img
                    className="generic-icon small"
                    src="/icons/star.svg"
                    alt="google"
                  />
                  <span>4.99 </span>{" "}
                  <span className="underline">1,000+ reviews</span>
                </span>
              </div>
            </a>
          </div>
        </div>

        <section className="featured-section-wrapper">
          <div className={styles["hero-input"]}>
            <FlowerDeliveryInput />
          </div>
          <div className="featured-content">
            <h2 className="featured-title text-center vertical-margin xl">
              Flower Delivery For All Occasions
            </h2>
            <div className="flex end full-width relative">
              <Link href="/product-category/birthday-flowers">
                <a className={styles["featured-occasion-details"]}>
                  <h3 className={styles.title}>BIRTHDAY FLOWERS</h3>
                  <span className={styles.subtitle}>
                    Celebrate them with beautiful handpicked fresh flowers
                    delivered right to their doorstep
                  </span>
                  <Button className={styles.button}>
                    SHOP BIRTHDAY FLOWERS
                  </Button>
                </a>
              </Link>
              <img
                alt="featured occasion"
                src="/images/occassions-birthday.png"
                className={styles["featured-occasion-image"]}
              />
            </div>

            <div className={[styles.section, styles.wrap].join(" ")}>
              {regalOccasions.map(occasion => (
                <OccasionCard
                  key={occasion.title}
                  name={occasion.title}
                  url={occasion.url}
                  image={occasion.image}
                  subTitle={occasion.subtitle}
                  mode="three-x-grid"
                  buttonText={occasion.cta}
                  color={occasion.color}
                />
              ))}
            </div>

            <div className="flex between">
              <h2 className="featured-title">BEST SELLING FLOWERS</h2>
              {deviceType === "desktop" && (
                <Button
                  url="/product-category/anniversary-flowers"
                  className="flex spaced center-align"
                  type="plain"
                >
                  <h3 className="red margin-right">See All</h3>
                </Button>
              )}
            </div>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {featuredBirthday?.map(flower => (
                <FlowerCard
                  key={flower.key}
                  image={flower.images[0]?.src || ""}
                  name={flower.name.split("–")[0]}
                  subTitle={flower.subtitle || flower.name.split("–")[1]}
                  price={flower.price}
                  url={`/product/${flower.slug}`}
                  buttonText="Add to Cart"
                  cart={flower.variants?.length ? false : true}
                  product={flower}
                />
              ))}
            </div>
            {deviceType === "mobile" && (
              <Button
                url="/product-category/anniversary-flowers"
                type="accent"
                minWidth
                className={styles["see-all"]}
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}

            <div className="vertical-margin xl">
              <h2 className="featured-title text-center full-width">
                What Makes <span className="primary-color">FloralHub</span> So
                Special?
              </h2>
              <div className={[styles["quote-flex"], styles.section].join(" ")}>
                <img
                  alt="quote"
                  src="/images/quote-1.png"
                  className={styles["quote-img"]}
                />
                <div className={styles.quote}>
                  "We don't just deliver flowers and gifts. Every flower and
                  gift delivery is a special experience between you and the
                  receiver, and we are happy to help create it.”
                </div>
                <img
                  alt="quote"
                  src="/images/quote-2.png"
                  className={styles["quote-img"]}
                />
              </div>
            </div>

            <div className="vertical-margin xl">
              <div className="flex between">
                <h2 className="featured-title">
                  Gifts to Include with Flowers
                </h2>
                {deviceType === "desktop" && (
                  <Button
                    url="/product-category/gifts"
                    className="flex spaced center-align"
                    type="plain"
                  >
                    <h3 className="red margin-right">See All</h3>
                  </Button>
                )}
              </div>
              <div className={[styles.section, styles.wrap].join(" ")}>
                {giftItems.map(gift => (
                  <FlowerCard
                    key={gift.name}
                    image={gift.image}
                    name={gift.name}
                    subTitle={gift.description}
                    url={gift.slug}
                    buttonText="VIEW GIFTS"
                    mode="four-x-grid"
                  />
                ))}
              </div>
            </div>

            {deviceType === "mobile" && (
              <Button
                url="/product-category/gifts"
                type="accent"
                minWidth
                className={styles["see-all"]}
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            )}

            <h2 className="featured-title full-width text-center">
              Why shop with us
            </h2>
            <div className={styles.section}>
              {regalFeatures.map(feature => (
                <ServiceCard
                  title={feature.title}
                  key={feature.title}
                  subtitle={feature.subtitle}
                  image={feature.image}
                  buttonText={feature.cta}
                  url={feature.url}
                />
              ))}
            </div>

            <h2 className="featured-title full-width text-center">
              Customer reviews
            </h2>
            <div className={styles["reviews-subtitle"]}>
              We pride ourselves on delivering a first class experience and
              always welcome feedback. This is key to helping us improve our
              service in every aspect of our business.
            </div>
          </div>
          <div className={styles["reviews-wrapper"]}>
            <div
              className={`flex center spaced-lg center-align ${deviceType ===
                "mobile" && "column text-center"}`}
            >
              <div className="flex column spaced center-align">
                <h2>Excellent</h2>
                <a
                  href="https://google.com"
                  target="_blank"
                  className={styles["google-review"]}
                  rel="noreferrer"
                >
                  <img
                    alt="stars"
                    src="/icons/stars.png"
                    className="generic-icon medium margin-bottom"
                  />
                  <div className="flex spaced center-align">
                    <img
                      className="generic-icon large"
                      src="/icons/google.svg"
                      alt="google"
                    />
                    <span className={styles.stats}>
                      Over <strong>4.99 </strong> <span> average review</span>
                    </span>
                  </div>
                </a>
              </div>
            </div>
            <img
              className={[
                styles["review-arrow"],
                styles["left-arrow"],
                currentReviewPageIndex > 0 && styles.active
              ].join(" ")}
              alt="previous"
              role="button"
              onClick={() =>
                setCurrentReviewPageIndex(currentReviewPageIndex - 1)
              }
              src="/icons/caret-right.svg"
            />
            <div className={styles.reviews}>
              {Array(reviewsPageCount)
                .fill("")
                .map((_, index) => (
                  <div
                    key={index}
                    className={[
                      styles["review-page"],
                      index === currentReviewPageIndex && styles.active
                    ].join(" ")}
                  >
                    {reviews[locationName]
                      .slice(
                        currentReviewPageIndex * 3,
                        currentReviewPageIndex * 3 + 3
                      )
                      .map(getReviewRender)}
                  </div>
                ))}
            </div>
            <img
              className={[
                styles["review-arrow"],
                currentReviewPageIndex < reviewsPageCount - 1 && styles.active
              ].join(" ")}
              alt="next"
              src="/icons/caret-right.svg"
              role="button"
              onClick={() =>
                setCurrentReviewPageIndex(currentReviewPageIndex + 1)
              }
            />
            <div className={styles["review-dots"]}>
              {Array(reviewsPageCount)
                .fill("")
                .map((_, index) => (
                  <span
                    key={index}
                    role="button"
                    onClick={() => setCurrentReviewPageIndex(index)}
                    className={[
                      styles.dot,
                      index === currentReviewPageIndex && styles.active
                    ].join(" ")}
                  ></span>
                ))}
            </div>
          </div>

          <div className={[styles["full-width-section"]].join(" ")}>
            <img
              className={styles.left}
              src="/images/landing-summary.png"
              alt="review"
            />
            <div className={styles.right}>
              <h2 className="featured-title">FINISHING TOUCHES</h2>
              <span className={styles.subtitle}>
                We know how important it is to make someone feel special. That's
                why we've hand-picked a range of lovely little extras you can
                add to your gift.
              </span>
              <Button
                padded
                url="/product-category/anniversary-flowers"
                className="margin-top"
                size="large"
                responsive
              >
                SHOP GIFTS
              </Button>
            </div>
          </div>

          <div className="featured-content">
            <div className="flex between center-align">
              <h2 className="featured-title text-center margin-bottom spaced">
                Our Blog
              </h2>
              <Button
                url="/product-category/gifts"
                className="flex spaced center-align"
                type="plain"
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            </div>
            <div className={styles.section}>
              {blogPosts.map(post => (
                <BlogCard
                  key={post.title}
                  title={post.title}
                  readDuration={post.readDuration}
                  date={post.date}
                  image={post.image}
                  excerpt={post.excerpt}
                  url="#"
                />
              ))}
            </div>
          </div>

          <div className={styles["subscribe-section"]}>
            <div className="flex column between">
              <div className="flex column spaced">
                <h2 className="featured-title unspaced">
                  Stay Updated With Our Newsletter
                </h2>
                <div className="grayed">
                  Get blog updates and special deals direct to your inbox
                </div>
              </div>
              <div>
                <span className="grayed semibold">Subscribe to updates</span>
                <form
                  className="flex spaced"
                  onSubmit={handleEmailSubscription}
                >
                  <Input
                    value={subscriptionEmail}
                    onChange={setSubscriptionEmail}
                    className="full-width"
                    placeholder="Enter email address"
                    icon="/icons/envelope.svg"
                    required
                    type="email"
                    name="email"
                  />
                  <Button buttonType="submit" loading={isSubscribing}>
                    SUBSCRIBE
                  </Button>
                </form>
              </div>
            </div>
            <img
              className={styles["subscribe-img"]}
              alt="subscribe"
              src="/images/subscribe-img.png"
            />
          </div>

          <InstagramFeed
            accessToken={
              process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN as string
            }
          />

          <div className={styles["story-section"]}>
            <div className={styles["story-wrapper"]}>
              <div
                className={[
                  styles.story,
                  minimizedStory && styles.minimized
                ].join(" ")}
              >
                <div className="flex column spaced margin-right">
                  <h2 className={styles["story-topic"]}>OUR STORY</h2>
                  <div className="flex column spaced">
                    <p className={styles.para}>
                      Deciding on where to buy fresh flowers in Lagos or where
                      to buy fresh flowers in Abuja? Floralhub.com.ng is the top
                      online fresh Flower Shop in Lagos, Nigeria and flower shop
                      in Abuja, Nigeria for same day delivery of all your fresh
                      flowers and gifts in Lagos, Nigeria and in Abuja, Nigeria.
                    </p>
                    <p className={styles.para}>
                      Whatever the occassion: Valentine’s Day flowers, Birthday
                      flowers, Anniversary flowers, Romance flowers, I am sorry
                      flowers, Bridal Bouquets, Mother’s Day flowers, Get Well
                      Soon flowers, Funeral Wreaths, or more, FloralHub.com is
                      the place to buy flowers online and get them delivered the
                      same day or in the future.
                    </p>
                    <p className={styles.para}>
                      You can buy various fresh flowers ranging from red roses,
                      white roses, pink roses, lilies, chrysanthemums,
                      hydrangeas, million stars, tulips, lily and more ans well
                      as various types of gifts such as cakes and cupcakes,
                      chocolates (such as Ferrero Rocher, Lindt chocolate etc),
                      wine and champagne (Moet Champagne, Veuve Clicquot, etc),
                      and red, white, pink or cream Teddy Bears in various
                      sizes.
                    </p>
                  </div>
                </div>
                <div className="flex column spaced">
                  <h2 className={styles["story-topic"]}>HOW TO ORDER</h2>
                  <div className="flex column spaced">
                    <p className={styles.para}>
                      Deciding on where to buy fresh flowers in Lagos or where
                      to buy fresh flowers in Abuja? Floralhub.com.ng is the top
                      online fresh Flower Shop in Lagos, Nigeria and flower shop
                      in Abuja, Nigeria for same day delivery of all your fresh
                      flowers and gifts in Lagos, Nigeria and in Abuja, Nigeria.
                    </p>
                    <p className={styles.para}>
                      Whatever the occassion: Valentine’s Day flowers, Birthday
                      flowers, Anniversary flowers, Romance flowers, I am sorry
                      flowers, Bridal Bouquets, Mother’s Day flowers, Get Well
                      Soon flowers, Funeral Wreaths, or more, FloralHub.com is
                      the place to buy flowers online and get them delivered the
                      same day or in the future.
                    </p>
                    <p className={styles.para}>
                      You can buy various fresh flowers ranging from red roses,
                      white roses, pink roses, lilies, chrysanthemums,
                      hydrangeas, million stars, tulips, lily and more ans well
                      as various types of gifts such as cakes and cupcakes,
                      chocolates (such as Ferrero Rocher, Lindt chocolate etc),
                      wine and champagne (Moet Champagne, Veuve Clicquot, etc),
                      and red, white, pink or cream Teddy Bears in various
                      sizes.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                className={styles.continue}
                type="plain"
                onClick={() => setMinimizedStory(!minimizedStory)}
              >
                {minimizedStory ? "Continue reading" : "See less"}
              </Button>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

const FlowerDeliveryInput: FunctionComponent = () => {
  const [occasion, setOccasion] = useState<Category>({
    name: "",
    id: "",
    slug: "",
    image: "",
    description: ""
  });
  const { deliveryDate, setDeliveryDate } = useContext(SettingsContext);
  const [occassionOptions, setOccassionOptions] = useState<
    PaginatedOptionsWrapper
  >({
    options: []
  });

  const deviceType = useDeviceType();

  const fetchCategories = async (props?: FetchResourceParams) => {
    const { pageNumber = 1, pageSize = 10, mergeRecords } = props || {};
    const response = await getCategories({ pageNumber, pageSize });
    const { data, error } = response;

    if (error) {
      return;
    } else if (data) {
      const category = data.map(category => ({
        value: category.id,
        label: category.name
      }));

      const options = [
        ...(mergeRecords ? occassionOptions.options : []),
        ...category
      ];

      setOccassionOptions({ options, hasNext: data.length > 0 });
    }
  };

  const handleOnselect = (value: string) => {
    const _selectedOccasion = allOccasionOptions.find(
      _occasion => _occasion.value === value
    )?.value as string;

    setOccasion(
      {
        name: _selectedOccasion,
        id: value,
        slug: "",
        image: "",
        description: ""
      } || null
    );
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["flower-input-wrapper"]}>
      <div className="full-width">
        <Select
          options={allOccasionOptions}
          value={occasion.id}
          onSelect={value => handleOnselect(value as string)}
          className={styles["occasion-select"]}
          placeholder={
            deviceType === "desktop" ? "Select Occasion" : "Occasion"
          }
          startIcon="/icons/bullet-points.svg"
          hideCaret
        />
        <DatePicker
          value={deliveryDate}
          onChange={setDeliveryDate}
          format="D MMM YYYY"
          className={styles["delivery-date"]}
          placeholder="Delivery Date"
          dropdownAlignment={deviceType === "mobile" ? "right" : "left"}
          iconAtLeft
          disablePastDays
        />
      </div>
      <Button
        padded
        url={`/product-category/${occasion?.name || "anniversary-flowers"}`}
        className={styles["input-submit"]}
      >
        Send Flowers
      </Button>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const locationName = "featured-birthday";
  const { data, error, message } = await getProductsBySlugs(
    featuredSlugs[locationName]
  );

  if (error) {
    console.error("Unable to fetch products by slugs: ", message);
  }

  return {
    props: {
      locationName: "general",
      featuredBirthday: data || []
    }
  };
};

export default LandingPage;
