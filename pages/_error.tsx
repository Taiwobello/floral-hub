import { NextPage } from "next";
import Button from "../components/button/Button";

const Error: NextPage<{ statusCode?: number }> = ({ statusCode }) => {
  return (
    <section className="page-content">
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
      <p>Please refresh and try again</p>
      <Button onClick={() => window.location.reload()}>Try again</Button>
    </section>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
