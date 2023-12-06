import { FunctionComponent } from "react";
import ProductsPage from "./filters";
import { websiteUrl } from "../utils/constants";
import Meta from "../components/meta/Meta";

const VipPage: FunctionComponent<{
  filters: string;
}> = ({}) => {
  return (
    <>
      <Meta canonicalUrl={`${websiteUrl}/vip-flowers`}></Meta>
      <ProductsPage
        productCategory="vip"
        productClass="vip"
        categorySlug="vip-flowers"
      />
    </>
  );
};

export default VipPage;
