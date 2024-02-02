import { FunctionComponent } from "react";
import Button from "../components/button/Button";

const TestError: FunctionComponent = () => {
  const obj = {};
  return (
    <section style={{ paddingTop: 100, paddingLeft: 100 }}>
      <Button
        onClick={() => {
          (obj as any).somtin();
        }}
      >
        Trigger Error
      </Button>
    </section>
  );
};

export default TestError;
