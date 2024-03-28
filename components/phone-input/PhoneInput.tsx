import React from "react";
import { countryCodes } from "../../utils/constants";
import Input from "../input/Input";
import Select from "../select/Select";
import styles from "./PhoneInput.module.scss";
import { phoneValidator } from "../../utils/helpers/validators";

type ValueType = string | number | string[] | number[];

type PhoneInputProps = {
  phoneNumber: string;
  countryCode: string;
  onChangeCountryCode: (value: string) => void;
  onChangePhoneNumber: (value: string) => void;
  question?: string;
  required?: boolean;
  className?: string;
  countryCodePlaceholder?: string;
  inputWrapperClassName?: string;
};

const PhoneInput = (props: PhoneInputProps) => {
  const {
    phoneNumber,
    countryCode,
    onChangeCountryCode,
    onChangePhoneNumber,
    question,
    required,
    className,
    countryCodePlaceholder,
    inputWrapperClassName
  } = props;

  return (
    <div className={["input-group", className].join(" ")}>
      <span className="question">{question || "Phone Number"}</span>
      <div
        className={[styles["input-wrapper"], inputWrapperClassName].join(" ")}
      >
        <Select
          onSelect={onChangeCountryCode as (value: ValueType) => void}
          value={countryCode}
          options={countryCodes}
          placeholder={countryCodePlaceholder || "+234"}
          responsive
          dimmed
          className={styles["country-code"]}
          display="value"
          dropdownClassName={styles["country-code-dropdown"]}
        />
        <Input
          placeholder=""
          value={phoneNumber}
          onChange={onChangePhoneNumber}
          dimmed
          responsive
          className={styles["phone-number"]}
          autoComplete="tel"
          required={required}
          onBlurValidation={() => phoneValidator(phoneNumber)}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
