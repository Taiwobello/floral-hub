import {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import SettingsContext from "../../utils/context/SettingsContext";
import {
  changePassword,
  login,
  requestOtp,
  signup,
  validteOTP
} from "../../utils/helpers/data/auth";
import RequestResponse from "../../utils/types/RequestResponse";
import Button from "../button/Button";
import Input from "../input/Input";
import styles from "./Layout.module.scss";
import Modal, { ModalProps } from "../modal/Modal";
import Checkbox from "../checkbox/Checkbox";
import { useRouter } from "next/router";

type FormType =
  | "login"
  | "signup"
  | "forgotPassword"
  | "validateOtp"
  | "newPassword"
  | "successful"
  | "guestCheckout";

type PasswordResetFormType =
  | "forgotPassword"
  | "validateOtp"
  | "newPassword"
  | "successful";

const descriptionTextMap: Record<PasswordResetFormType, string> = {
  forgotPassword: "No worries, we’ll send you reset instructions.",
  newPassword:
    "Your new password must be different to previously used passwords.",
  validateOtp: "We sent an one-time password to",
  successful:
    "Your password has been successfully reset. Click “continue” to log in magically."
};

const iconMap: Record<PasswordResetFormType, JSX.Element | null> = {
  successful: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className="generic-icon large"
    >
      <path
        d="M25.6663 12.9267V14C25.6649 16.5158 24.8503 18.9638 23.3439 20.9788C21.8375 22.9938 19.7202 24.4679 17.3076 25.1812C14.895 25.8945 12.3165 25.8089 9.95656 24.937C7.59664 24.0652 5.58177 22.4538 4.21246 20.3433C2.84315 18.2327 2.19276 15.7361 2.3583 13.2257C2.52383 10.7153 3.49642 8.32572 5.131 6.41326C6.76559 4.50079 8.97459 3.16795 11.4286 2.61351C13.8825 2.05907 16.45 2.31273 18.748 3.33667M25.6663 4.66667L13.9997 16.345L10.4997 12.845"
        stroke="#039855"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  forgotPassword: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className="generic-icon large"
    >
      <path
        d="M18.0837 8.74992L22.167 4.66659M24.5003 2.33325L22.167 4.66659L24.5003 2.33325ZM13.2887 13.5449C13.8911 14.1393 14.3699 14.847 14.6977 15.6272C15.0255 16.4074 15.1957 17.2447 15.1985 18.091C15.2014 18.9373 15.0368 19.7757 14.7142 20.5581C14.3917 21.3405 13.9176 22.0514 13.3192 22.6498C12.7208 23.2482 12.0099 23.7223 11.2275 24.0448C10.4451 24.3674 9.60665 24.532 8.76039 24.5291C7.91413 24.5263 7.07679 24.3561 6.29658 24.0283C5.51637 23.7005 4.8087 23.2216 4.21432 22.6193C3.04547 21.4091 2.39871 19.7882 2.41333 18.1058C2.42795 16.4233 3.10278 14.814 4.29248 13.6242C5.48219 12.4345 7.09157 11.7597 8.774 11.7451C10.4564 11.7305 12.0773 12.3772 13.2875 13.5461L13.2887 13.5449ZM13.2887 13.5449L18.0837 8.74992L13.2887 13.5449ZM18.0837 8.74992L21.5837 12.2499L25.667 8.16659L22.167 4.66659L18.0837 8.74992Z"
        stroke="#B240DA"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  newPassword: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className="generic-icon large"
    >
      <path
        d="M18.0837 8.74992L22.167 4.66659M24.5003 2.33325L22.167 4.66659L24.5003 2.33325ZM13.2887 13.5449C13.8911 14.1393 14.3699 14.847 14.6977 15.6272C15.0255 16.4074 15.1957 17.2447 15.1985 18.091C15.2014 18.9373 15.0368 19.7757 14.7142 20.5581C14.3917 21.3405 13.9176 22.0514 13.3192 22.6498C12.7208 23.2482 12.0099 23.7223 11.2275 24.0448C10.4451 24.3674 9.60665 24.532 8.76039 24.5291C7.91413 24.5263 7.07679 24.3561 6.29658 24.0283C5.51637 23.7005 4.8087 23.2216 4.21432 22.6193C3.04547 21.4091 2.39871 19.7882 2.41333 18.1058C2.42795 16.4233 3.10278 14.814 4.29248 13.6242C5.48219 12.4345 7.09157 11.7597 8.774 11.7451C10.4564 11.7305 12.0773 12.3772 13.2875 13.5461L13.2887 13.5449ZM13.2887 13.5449L18.0837 8.74992L13.2887 13.5449ZM18.0837 8.74992L21.5837 12.2499L25.667 8.16659L22.167 4.66659L18.0837 8.74992Z"
        stroke="#B240DA"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  validateOtp: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className="generic-icon large"
    >
      <path
        d="M25.6663 7.00008C25.6663 5.71675 24.6163 4.66675 23.333 4.66675H4.66634C3.38301 4.66675 2.33301 5.71675 2.33301 7.00008M25.6663 7.00008V21.0001C25.6663 22.2834 24.6163 23.3334 23.333 23.3334H4.66634C3.38301 23.3334 2.33301 22.2834 2.33301 21.0001V7.00008M25.6663 7.00008L13.9997 15.1667L2.33301 7.00008"
        stroke="#B240DA"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
};

const loginTextMap: Record<PasswordResetFormType, string> = {
  forgotPassword: "Reset Password",
  newPassword: "Reset Password",
  validateOtp: "Submit OTP",
  successful: "Continue"
};

const titleMap: Record<FormType, string> = {
  forgotPassword: "Forgot password?",
  newPassword: "Set new password",
  validateOtp: "Enter OTP",
  successful: "Password reset",
  login: "Login",
  signup: "Register",
  guestCheckout: "Guest Checkout"
};

const AuthModal: FunctionComponent<ModalProps> = props => {
  const { visible, cancel } = props;
  const [formType, setFormType] = useState<FormType>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [shouldsubscribeEmail, setShouldSubscribeEmail] = useState(false);

  const { notify, setUser, user } = useContext(SettingsContext);

  const { pathname } = useRouter();
  const _pathname = pathname.split("/")[1];

  useEffect(() => {
    if (_pathname === "checkout" && !user) {
      setFormType("guestCheckout");
    } else {
      setFormType("login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_pathname]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formType === "newPassword") {
      if (password !== passwordConfirm) {
        notify("error", "Passwords do not match");
        return;
      }
    }

    const handlerMap: Partial<Record<
      FormType,
      () => Promise<RequestResponse>
    >> = {
      login: () => login(email, password),
      signup: () => signup(email, password),
      forgotPassword: () => requestOtp(email),
      validateOtp: () => validteOTP(email, otp),
      newPassword: () => changePassword(password)
    };
    setLoading(true);
    const response = await handlerMap[formType]?.();
    setLoading(false);
    if (response?.error) {
      if (response.message?.includes("Upgrade is required for legacy user")) {
        setFormType("validateOtp");
        notify(
          "info",
          "Your password has expired. Please enter the OTP sent to your inbox"
        );
        return;
      }
      notify(
        "error",
        `Unable to ${titleMap[formType].toLowerCase()}: ${response.message}`
      );
    } else {
      if (formType === "login" || formType === "signup") {
        setUser(response?.data);
        cancel?.();
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        notify(
          "success",
          formType === "login"
            ? `Logged in successfully as ${email}`
            : "User signed up successfully"
        );
      } else if (formType === "forgotPassword") {
        setPassword("");
        setFormType("validateOtp");
        notify("success", `One-time password has been sent to ${email}`);
      } else if (formType === "validateOtp") {
        setPassword("");
        setPasswordConfirm("");
        setOtp("");
        setFormType("newPassword");
        setUser(response?.data);
        notify("success", "OTP validated successfully");
      } else if (formType === "newPassword") {
        setPassword("");
        setPasswordConfirm("");
        setFormType("successful");
        notify("success", "Password changed successfully and user logged in");
        setUser(response?.data);
      } else if (formType === "successful") {
        cancel?.();
        setFormType("login");
      }
    }
  };

  return (
    <Modal
      visible={visible}
      modalDesign="custom"
      className="scrollable"
      cancel={cancel}
    >
      <div className={styles["auth-form"]}>
        {["login", "signup", "guestCheckout"].includes(formType) ? (
          <>
            <h2 className="text-center text-large margin-bottom">
              {_pathname === "checkout"
                ? "WELCOME TO SECURE CHECKOUT"
                : "WELCOME TO FLORALHUB"}
            </h2>
            {_pathname === "checkout" && !user && (
              <div
                className={[styles["form-wrapper"], styles["login"]].join(" ")}
              >
                <Checkbox
                  text={
                    <span className={styles["checkbox-text"]}>
                      <strong className="text-regular">Guest Checkout</strong>
                    </span>
                  }
                  type="primary"
                  checked={formType === "guestCheckout"}
                  rounded
                  onChange={() => setFormType("guestCheckout")}
                />

                {formType === "guestCheckout" && (
                  <Button
                    buttonType="button"
                    responsive
                    onClick={() => cancel?.()}
                    className="margin-top spaced"
                  >
                    Continue as Guest
                  </Button>
                )}
              </div>
            )}
            <div
              className={[styles["form-wrapper"], styles["signup"]].join(" ")}
            >
              <Checkbox
                text={
                  <span className={styles["checkbox-text"]}>
                    <strong className="text-regular">Register</strong>
                    <span className="grayed">
                      Don’t have an account? Register below to:
                    </span>
                  </span>
                }
                type="primary"
                checked={formType === "signup"}
                onChange={() => setFormType("signup")}
                rounded
              />
              <ul className={["text-small", styles["list"]].join(" ")}>
                <li>
                  Access to your delivery history so you never forget an
                  occasion.
                </li>
                <li>
                  Address book setup to make your next order as easy as
                  possible.
                </li>
              </ul>

              <form
                className={[
                  styles["signup-form"],
                  formType !== "signup" && styles.collapse
                ].join(" ")}
                onSubmit={handleSubmit}
              >
                <div className="input-group">
                  <span className="question">First Name</span>
                  <Input
                    value={firstName}
                    onChange={setFirstName}
                    placeholder="John"
                    type="text"
                    name="fname"
                    required
                    responsive
                    autoComplete="given-name"
                  />
                </div>
                <div className="input-group vertical-margin spaced">
                  <span className="question">Last Name</span>
                  <Input
                    value={lastName}
                    onChange={setLastName}
                    placeholder="Doe"
                    type="text"
                    name="lastName"
                    required
                    responsive
                  />
                </div>
                <div className="input-group">
                  <span className="question">Email address</span>
                  <Input
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter email"
                    type="email"
                    name="email"
                    required
                    responsive
                  />
                </div>

                <div className="input-group vertical-margin spaced">
                  <span className="question">Password</span>
                  <Input
                    value={password}
                    onChange={setPassword}
                    type="password"
                    autoComplete={
                      formType === "signup" ? "new-password" : "password"
                    }
                    placeholder="Enter password"
                    required
                    showPasswordIcon
                    responsive
                  />
                </div>

                <Checkbox
                  text="Yes, I would like to receive offers, updates and marketing from Floralhub via email, post and online advertising. You can opt in / out at any time."
                  type="secondary"
                  checked={shouldsubscribeEmail}
                  onChange={() =>
                    setShouldSubscribeEmail(!shouldsubscribeEmail)
                  }
                  className=""
                />

                <Button
                  buttonType="submit"
                  loading={loading}
                  className="vertical-margin spaced"
                  responsive
                >
                  Register
                </Button>
              </form>
            </div>
            <div
              className={[styles["form-wrapper"], styles["login"]].join(" ")}
            >
              <Checkbox
                text={
                  <span className={styles["checkbox-text"]}>
                    <strong className="text-regular">Login</strong>
                    <span className="grayed">
                      If you’ve already registered.
                    </span>
                  </span>
                }
                type="primary"
                checked={formType === "login"}
                onChange={() => setFormType("login")}
                rounded
              />

              <form
                className={[
                  styles["login-form"],
                  formType !== "login" && styles.collapse
                ].join(" ")}
                onSubmit={handleSubmit}
              >
                <div className="input-group">
                  <span className="question">Email address</span>
                  <Input
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter email"
                    type="email"
                    name="email"
                    required
                    responsive
                  />
                </div>

                <div className="input-group vertical-margin spaced">
                  <span className="question">Password</span>
                  <Input
                    value={password}
                    onChange={setPassword}
                    type="password"
                    autoComplete={
                      formType === "signup" ? "new-password" : "password"
                    }
                    placeholder="Enter password"
                    required
                    showPasswordIcon
                    responsive
                  />
                </div>

                <button
                  type="button"
                  className="primary-color bold underline"
                  onClick={() => setFormType("forgotPassword")}
                >
                  Reset your password
                </button>

                <Button
                  buttonType="submit"
                  loading={loading}
                  className="vertical-margin spaced"
                  responsive
                >
                  Login
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className={styles["password-reset"]}>
            <div
              className={[
                styles.icon,
                formType === "successful" && styles.success
              ].join(" ")}
            >
              {iconMap[formType as PasswordResetFormType]}
            </div>

            <h1>{titleMap[formType]}</h1>
            <p className="grayed text-small">{`${
              descriptionTextMap[formType as PasswordResetFormType]
            } ${formType === "validateOtp" ? email : ""} `}</p>
            {
              <form
                className={[styles["login-form"]].join(" ")}
                onSubmit={handleSubmit}
              >
                {formType === "forgotPassword" && (
                  <div className="input-group vertical-margin xl">
                    <span className="question">Email address</span>
                    <Input
                      value={email}
                      onChange={setEmail}
                      placeholder="Enter email"
                      type="email"
                      name="email"
                      required
                      responsive
                      autoComplete="username"
                    />
                  </div>
                )}

                {formType === "validateOtp" && (
                  <Input
                    value={otp}
                    onChange={setOtp}
                    placeholder="Enter OTP sent to your inbox"
                    required
                    responsive
                    className="margin-top spaced"
                  />
                )}
                {formType === "newPassword" && (
                  <>
                    <div className="input-group vertical-margin xl">
                      <span className="question">Password</span>
                      <Input
                        value={password}
                        onChange={setPassword}
                        type="password"
                        autoComplete="new-password"
                        placeholder="Enter password"
                        required
                        showPasswordIcon
                        responsive
                      />
                    </div>
                    <div className="input-group vertical-margin">
                      <span className="question">Confirm Password</span>
                      <Input
                        value={passwordConfirm}
                        onChange={setPasswordConfirm}
                        type="password"
                        placeholder="Confirm password"
                        required
                        showPasswordIcon
                        responsive
                      />
                    </div>
                  </>
                )}
                <Button
                  buttonType="submit"
                  loading={loading}
                  className="vertical-margin xl"
                  responsive
                >
                  {loginTextMap[formType as PasswordResetFormType]}
                </Button>
                {/* {formType === "validateOtp" && (
                  <p className="margin-bottom spaced text-small">
                    Didn’t receive the email?{" "}
                    <button className="primary-color bold" type="button">
                      Click to resend
                    </button>
                  </p>
                )} */}
                <button
                  className={styles["bottom-text"]}
                  onClick={() => setFormType("login")}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="generic-icon"
                  >
                    <path
                      d="M15.8337 10.0001H4.16699M4.16699 10.0001L10.0003 15.8334M4.16699 10.0001L10.0003 4.16675"
                      stroke="#667085"
                      strokeWidth="1.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>{" "}
                  <span>Back to log in</span>
                </button>
              </form>
            }
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
