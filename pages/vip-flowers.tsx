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
  return (
    <>
      <Meta canonicalUrl={`${websiteUrl}/vip-flowers`}></Meta>
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
      props: {}
    };
  }
  console.log("data", data);
  return {
    props: {
      category: data
    }
  };
};
