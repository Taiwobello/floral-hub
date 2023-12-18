import { FunctionComponent } from "react";
import ProductsPage from "./filters";
import { websiteUrl } from "../utils/constants";
import Meta from "../components/meta/Meta";
import { getCategory } from "../utils/helpers/data/category";
import { Category } from "../utils/types/Category";
import { GetStaticProps } from "next";

const VipPage: FunctionComponent<{
  filters: string;
  category: Category;
}> = ({ category }) => {
  if (!category.slug) {
    console.log("attempting reload vip");
    window.location.reload();
    return null;
  }
  return (
    <>
      <Meta canonicalUrl={`${websiteUrl}/vip-flowers/`}></Meta>
      <ProductsPage
        productCategory="vip"
        productClass="vip"
        categorySlug="vip-flowers"
        category={category || undefined}
      />
    </>
  );
};

export default VipPage;

export const getStaticProps: GetStaticProps = async () => {
  const { error, message, data } = await getCategory("vip-flowers");

  if (error) {
    console.error("Unable to fetch Category", message);

    return {
      props: {
        category: {
          name: "",
          slug: ""
        }
      },
      revalidate: 1800
    };
  }
  // console.log("data", data);
  return {
    props: {
      category: data
    },
    revalidate: 1800
  };
};
