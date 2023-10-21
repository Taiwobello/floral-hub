import RequestResponse from "../../types/RequestResponse";
import { restAPIInstance } from "../rest-api-config";

export const sendClientMessage: (payload: {
  name: string;
  email: string;
  message: string;
}) => Promise<RequestResponse<boolean>> = async payload => {
  try {
    const response = await restAPIInstance.post(
      `/v1/floralhub//client-message`,
      payload
    );
    return {
      error: false,
      message: response.message,
      data: null
    };
  } catch (err) {
    console.error("Unable to verify paystack payment: ", err);
    return {
      error: true,
      message: (err as Error).message,
      data: null
    };
  }
};
