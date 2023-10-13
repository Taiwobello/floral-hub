import { FunctionComponent, useState } from "react";
import styles from "./index.module.scss";
import { contactUsPageConent } from "../../utils/constants";
import Input, { TextArea } from "../../components/input/Input";
import Button from "../../components/button/Button";
import useDeviceType from "../../utils/hooks/useDeviceType";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";

const initialContactData = {
  name: "",
  email: "",
  message: ""
};

const breadcrumbItems = [{ label: "Home", link: "/" }, { label: "Contact" }];

const Index: FunctionComponent = () => {
  const [formData, setFormData] = useState(initialContactData);

  const deviceType = useDeviceType();

  const handleChange = (key: string, value: unknown) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };
  return (
    <section className={[styles["page-wrapper"], "text-medium"].join(" ")}>
      <Breadcrumb items={breadcrumbItems} />
      <h1 className={styles.title}>CONTACT US</h1>

      <p className="text-large primary-color">Our Offices</p>
      <div className={styles.offices}>
        <div className={styles.office}>
          <strong className="text-regular margin-bottom spaced">
            {contactUsPageConent.lagosDetails.text}
          </strong>
          <div className={styles.info}>
            <div className="flex spaced">
              <img
                src="/icons/map-pin.svg"
                alt="map pin"
                className="generic-icon medium"
              />
              <p>{contactUsPageConent.lagosDetails.address}</p>
            </div>
            <div>
              <p className="flex spaced center-align margin-bottom">
                <img
                  src="/icons/phone.svg"
                  alt="phone"
                  className="generic-icon medium"
                />{" "}
                <span>{contactUsPageConent.lagosDetails.phoneNo}</span>{" "}
              </p>
              <p className="flex spaced center-align">
                <img
                  src="/icons/whatsapp.svg"
                  alt="whatsapp"
                  className="generic-icon medium"
                />{" "}
                <span>{contactUsPageConent.lagosDetails.phoneNo}</span>{" "}
              </p>
            </div>
          </div>
          <img src="/images/map.png" alt="whatsapp" className={styles.map} />
        </div>
        <div className={styles.office}>
          <strong className="text-regular margin-bottom spaced">
            {contactUsPageConent.abujaDetails.text}
          </strong>
          <div className={styles.info}>
            <div className="flex spaced">
              <img
                src="/icons/map-pin.svg"
                alt="map pin"
                className="generic-icon medium"
              />
              <p>{contactUsPageConent.abujaDetails.address}</p>
            </div>
            <div>
              <p className="flex spaced center-align margin-bottom">
                <img
                  src="/icons/phone.svg"
                  alt="phone"
                  className="generic-icon medium"
                />{" "}
                <span>{contactUsPageConent.abujaDetails.phoneNo}</span>{" "}
              </p>
              <p className="flex spaced center-align">
                <img
                  src="/icons/whatsapp.svg"
                  alt="whatsapp"
                  className="generic-icon medium"
                />{" "}
                <span>{contactUsPageConent.abujaDetails.phoneNo}</span>{" "}
              </p>
            </div>
          </div>
          <img src="/images/map.png" alt="whatsapp" className={styles.map} />
        </div>
      </div>

      <div>
        <p
          className={`primary-color margin-bottom text-large ${
            deviceType === "desktop" ? "bold" : ""
          }`}
        >
          Leave Us a Message
        </p>
        <div className={styles["form-wrapper"]}>
          <form className={styles.form}>
            <div className="input-group">
              <span className="question">Name</span>
              <Input
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={value => handleChange("name", value)}
                required
                responsive
              />
            </div>
            <div className="input-group">
              <span className="question">Email Address</span>
              <Input
                name="email"
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={value => handleChange("email", value)}
                required
                responsive
              />
            </div>
            <div className="input-group">
              <span className="question">Message</span>
              <TextArea
                name="message"
                placeholder="Say Something..."
                value={formData.message}
                onChange={value => handleChange("message", value)}
              />
            </div>
            <Button
              responsive
              buttonType="submit"
              className="margin-top spaced"
            >
              Send Message
            </Button>
          </form>
          <img
            src="/images/contact-flower.png"
            alt="flower"
            className={styles["form-image"]}
          />
        </div>
      </div>
    </section>
  );
};

export default Index;
