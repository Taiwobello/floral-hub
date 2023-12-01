import {
  CSSProperties,
  FormEvent,
  FunctionComponent,
  useCallback,
  useContext,
  useState
} from "react";
import styles from "./contact.module.scss";
import { contactUsPageContent } from "../utils/constants";
import Input, { TextArea } from "../components/input/Input";
import Button from "../components/button/Button";
import useDeviceType from "../utils/hooks/useDeviceType";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import { sendClientMessage } from "../utils/helpers/data/message";
import SettingsContext from "../utils/context/SettingsContext";
import { emailValidator } from "../utils/helpers/validators";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { LocationName } from "../utils/types/Regal";

const initialContactData = {
  name: "",
  email: "",
  message: ""
};

const center = {
  lat: 6.458329,
  lng: 3.413628
};

const containerStyle: CSSProperties = {
  width: "100%",
  height: "33rem",
  borderRadius: "0.5rem"
};

const breadcrumbItems = [{ label: "Home", link: "/" }, { label: "Contact" }];

const Index: FunctionComponent = () => {
  const [formData, setFormData] = useState(initialContactData);
  const { notify } = useContext(SettingsContext);
  const [loading, setLoading] = useState(false);
  const [, setMap] = useState(null);

  const deviceType = useDeviceType();

  const handleChange = (key: string, value: unknown) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name) {
      notify("error", "Please enter your name");
      return;
    } else if (!email) {
      notify("error", "Please enter your email address");
      return;
    } else if (!message) {
      notify("error", "Please enter your message");
      return;
    }
    setLoading(true);
    const response = await sendClientMessage(formData);

    if (!response.error) {
      setFormData(initialContactData);
      notify("success", "Message sent successfully");
    }

    setLoading(false);
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  return (
    <section className={[styles["page-wrapper"], "text-medium"].join(" ")}>
      <Breadcrumb items={breadcrumbItems} />
      <h1 className={styles.title}>CONTACT US</h1>

      <p className="text-large primary-color">Our Offices</p>
      <div className={styles.offices}>
        {Object.keys((key: LocationName) => (
          <div className={styles.office}>
            <strong className="text-medium margin-bottom spaced">
              {contactUsPageContent[key]?.text}
            </strong>
            <div className={styles.info}>
              <div className="flex spaced">
                <img
                  src="/icons/map-pin.svg"
                  alt="map pin"
                  className="generic-icon medium"
                />
                <p>{contactUsPageContent[key]?.address}</p>
              </div>
              <div>
                <p className="flex spaced center-align margin-bottom">
                  <img
                    src="/icons/phone.svg"
                    alt="phone"
                    className="generic-icon medium"
                  />{" "}
                  <span>{contactUsPageContent[key]?.phoneNo}</span>{" "}
                </p>
                <p className="flex spaced center-align">
                  <img
                    src="/icons/whatsapp.svg"
                    alt="whatsapp"
                    className="generic-icon medium"
                  />{" "}
                  <span>{contactUsPageContent[key]?.phoneNo}</span>{" "}
                </p>
              </div>
            </div>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                <Marker position={center} />
              </GoogleMap>
            ) : (
              <></>
            )}
          </div>
        ))}
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
          <form className={styles.form} onSubmit={handleSendMessage}>
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
                onBlurValidation={emailValidator}
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
              loading={loading}
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
