import {
  CSSProperties,
  FormEvent,
  FunctionComponent,
  useCallback,
  useContext,
  useState
} from "react";
import styles from "./index.module.scss";
import { contactUsPageConent } from "../../utils/constants";
import Input, { TextArea } from "../../components/input/Input";
import Button from "../../components/button/Button";
import useDeviceType from "../../utils/hooks/useDeviceType";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import { sendClientMessage } from "../../utils/helpers/data/message";
import SettingsContext from "../../utils/context/SettingsContext";
import { emailValidator } from "../../utils/helpers/validators";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Polygon
} from "@react-google-maps/api";

const initialContactData = {
  name: "",
  email: "",
  message: ""
};

const center = {
  lat: 31.968599,
  lng: -99.90181
};

const containerStyle: CSSProperties = {
  width: "100%",
  height: "33rem",
  borderRadius: "0.5rem"
};

const polygonCoords = [
  { lat: -34.4, lng: 150.6 },
  { lat: -34.45, lng: 150.7 },
  { lat: -34.35, lng: 150.8 }
];

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
        <div className={styles.office}>
          <strong className="text-medium margin-bottom spaced">
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
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              <Marker position={center} />
              <Polygon
                paths={[polygonCoords]}
                options={{
                  fillColor: "blue",
                  fillOpacity: 0.4,
                  strokeColor: "red",
                  strokeOpacity: 1,
                  strokeWeight: 2
                }}
              />
            </GoogleMap>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.office}>
          <strong className="text-medium margin-bottom spaced">
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
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              <Marker position={center} />
              <Polygon
                paths={[polygonCoords]}
                options={{
                  fillColor: "blue",
                  fillOpacity: 0.4,
                  strokeColor: "red",
                  strokeOpacity: 1,
                  strokeWeight: 2
                }}
              />
            </GoogleMap>
          ) : (
            <></>
          )}
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
