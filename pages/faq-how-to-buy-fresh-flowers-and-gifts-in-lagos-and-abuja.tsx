import { GetStaticProps } from "next";
import React, { FunctionComponent, useState } from "react";
import Button from "../components/button/Button";
import FlowerCard from "../components/flower-card/FlowerCard";
import { FAQs, featuredSlugs, websiteUrl } from "../utils/constants";
import { getProductsBySlugs } from "../utils/helpers/data/products";
import Product from "../utils/types/Product";
import styles from "./faq.module.scss";
import Meta from "../components/meta/Meta";
import SchemaMarkup from "../components/schema-mark-up/SchemaMarkUp";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";

const schemaProperties = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I order flowers and gifts on FloralHub.com.ng?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "There are several ways to order. Either online, or by Phone/Whatsapp on +234 907 777 7994 <br> <br> We can also customize a bouquet to fit your budget, preferred colours, flower types etc.Do feel free to reach our line, or email us info@floralhub.com.ng"
      }
    },
    {
      "@type": "Question",
      name: "Is same day delivery possible?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "You can order flowers and gifts online through our website 24/7, or you can visit one of our physical locations in Lagos and Abuja, Nigeria. We are open 24 hours, allowing you to walk in at any time or order online 24/7."
      }
    },
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "We accept Credit/Debit Cards, Paypal, Bitcoin, and Bank Transfer."
      }
    },
    {
      "@type": "Question",
      name: "Do you offer same-day delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer same-day delivery across Lagos and Abuja, Nigeria."
      }
    },
    {
      "@type": "Question",
      name: "How do I buy fresh flowers from Floral Hub?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "You can buy fresh flowers from Floral Hub by visiting our website or one of our physical locations in Lagos and Abuja. We offer a wide selection of fresh flowers for all occasions. We are open 24 hours, allowing you to walk in at any time or order online 24/7."
      }
    },
    {
      "@type": "Question",
      name: "Can I track my flower delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, you can track your flower delivery. We provide tracking information once your order is processed, allowing you to monitor the status of your delivery."
      }
    },
    {
      "@type": "Question",
      name: "Do you offer international flower delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "At the moment, we primarily offer flower delivery within Lagos and Abuja, Nigeria. However, please contact us for special inquiries regarding international flower delivery."
      }
    },
    {
      "@type": "Question",
      name: "How to send flowers to someone in Lagos or Abuja, Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sending flowers to someone in Lagos or Abuja, Nigeria is easy with Floral Hub. You can place an order on our website 24/7 and select the delivery address within Lagos or Abuja. We offer same-day delivery to make your gesture even more special. Additionally, you can walk in 24 hours to our physical locations to purchase flowers."
      }
    },
    {
      "@type": "Question",
      name: "What are your opening hours?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "We are open 24 hours every day, including public holidays. You can shop for flowers and gifts at any time that is convenient for you. We welcome walk-ins 24 hours a day."
      }
    },
    {
      "@type": "Question",
      name: "How to send gifts to someone in Lagos or Abuja, Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sending gifts to someone in Lagos or Abuja, Nigeria is simple with Floral Hub. Just visit our website, choose from our selection of gifts, and specify the delivery address within Lagos or Abuja. We'll ensure your gift is delivered promptly."
      }
    },
    {
      "@type": "Question",
      name: "Best flower shop in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Floral Hub is widely recognized as the best flower shop in Lagos, Nigeria. We have the highest number of reviews and also the highest reviewed flower shop in the country across our branches. Our commitment to quality, same-day delivery, and our extensive selection of fresh flowers and gifts sets us apart. We've also had the privilege of delivering to various celebrities, including two Nigerian Presidents. Additionally, we are open 24 hours, making it convenient for you to choose and send flowers at any time."
      }
    },
    {
      "@type": "Question",
      name: "Best flower shop in Abuja?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Floral Hub is also recognized as the best flower shop in Abuja, Nigeria. We are known for our exceptional service, high-quality flowers, and a wide range of gift options. Our reputation as the best flower shop in Abuja is backed by numerous positive reviews from satisfied customers. Additionally, we offer 24-hour service, making it convenient for you to shop for flowers and gifts at any time."
      }
    },
    {
      "@type": "Question",
      name: "Why are flowers so expensive in Lagos and Abuja, Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Flowers can be expensive in Lagos and Abuja, Nigeria due to factors such as import costs, transportation, unsteady electricity, and the high cost of refrigeration. However, at Floral Hub, we strive to offer competitive prices while ensuring the freshest and most beautiful flowers for our customers. You can read more about this on our blog: <a href='https://floralhub.com.ng/blog/why-are-flowers-so-expensive-in-nigeria/' target='_blank'>Why Are Flowers So Expensive in Nigeria?</a>"
      }
    }
  ],
  name: "Frequently Asked Questions - Floral Hub",
  url:
    "https://floralhub.com.ng/faq-how-to-buy-fresh-flowers-and-gifts-in-lagos-and-abuja"
};
const breadcrumbItems = [{ label: "Home", link: "/" }, { label: "FAQ" }];
const Index: FunctionComponent<{ featuredFlowers: Product[] }> = ({
  featuredFlowers
}) => {
  // const [activeContent, setActiveContent] = useState<ContentLink | null>(null);
  const [openQuestions, setOpenQuestions] = useState<OpenQuestions>({});
  const questionList = FAQs;
  interface OpenQuestions {
    [key: number]: boolean;
  }
  const toggleAnswer = (index: number) => {
    setOpenQuestions(prevOpenQuestions => ({
      ...prevOpenQuestions,
      [index]: !prevOpenQuestions[index]
    }));
  };

  const questions = questionList.map((question, index) => {
    const isAnswerOpen = openQuestions[index] || false;

    return (
      <div key={index} className="faq-question-container">
        <div
          className={`${styles["faq-question"]} ${
            isAnswerOpen ? styles["faq-question-open"] : ""
          }`}
          onClick={() => toggleAnswer(index)}
        >
          <p
            className={`${styles["question-text"]} ${
              isAnswerOpen ? styles["question-text-open"] : ""
            }`}
          >
            {question.name}
          </p>
          <div
            className={`flex ${styles["icon-container"]} ${
              isAnswerOpen ? styles["icon-container-open"] : ""
            }`}
          >
            <img
              src={
                isAnswerOpen
                  ? "/icons/minus_circle_outline.svg"
                  : "/icons/plus_circle_outline.png"
              }
              alt="expand-question-icon"
              className={styles["expand-icon"]}
            />
          </div>
        </div>

        <div
          className={`${
            isAnswerOpen ? styles["faq-answer"] : styles["faq-answer-closed"]
          }`}
        >
          {question.acceptedAnswer.text}{" "}
        </div>
      </div>
    );
  });
  console.log({ featuredFlowers });
  return (
    <>
      <Meta
        title="Frequently Asked Questions - Floral Hub"
        description="How to Order Flowers and Gifts in Lagos and Abuja and Delivery Information | Floral Hub & Gifts"
        canonicalUrl={`${websiteUrl}/faq-how-to-buy-fresh-flowers-and-gifts-in-lagos-and-abuja/`}
        url={`${websiteUrl}/faq-how-to-buy-fresh-flowers-and-gifts-in-lagos-and-abuja`}
        image="/images/popular-bundled.jpg"
        imageAlt="Frequently Asked Questions - Floral Hub"
      >
        <SchemaMarkup properties={schemaProperties} />
      </Meta>
      <section className={styles.wrapper}>
        <div className={[styles["hero-bg"], "hero-bg"].join(" ")}>
          <div className={styles["hero-content"]}>
            <Breadcrumb items={breadcrumbItems} />
            <p className={styles.title}>HOW CAN WE HELP?</p>
          </div>
        </div>
        <div className={styles.container}>
          <div className={`${styles.content} flex between spaced-xl`}>
            <div className={styles["faq-body"]}>
              <h2 className={styles["sub-title"]}>
                FREQUENTLY ASKED QUESTIONS
              </h2>
              {questions}
            </div>
          </div>
          <div className={`margin-bottom spaced ${styles["flowers-wrapper"]}`}>
            <span className={styles.title}>BEST SELLING FLOWERS</span>
            <Button
              url="/product-category/all"
              className="flex spaced center center-align"
              type="transparent"
            >
              <h3 className="red margin-right">See All</h3>
            </Button>
          </div>
          <div
            className={`${styles["flowers-wrapper"]} ${styles.wrap} ${styles["bottom-margin"]}`}
          >
            {featuredFlowers?.map(flower => (
              <FlowerCard
                key={flower.key}
                image={flower.images[0]?.src || ""}
                name={flower.name}
                subTitle={flower.subtitle || flower.name.split("–")[1]}
                price={flower.price}
                url={`/product/${flower.slug}`}
                buttonText={
                  flower.variants?.length ? "Select Size" : "Add to Cart"
                }
                cart={flower.variants?.length ? false : true}
                product={flower}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error, message } = await getProductsBySlugs(
    featuredSlugs["featured-birthday"]
  );
  if (error) {
    console.error("Unable to fetch products by slugs: ", message);
  }
  return {
    props: {
      featuredFlowers: data || []
    },
    revalidate: 1800
  };
};

export default Index;
