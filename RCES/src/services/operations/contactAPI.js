import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { contactEndpoints } from "../apis";

// Submit contact us form
export const submitContactForm = async (formData) => {
  const toastId = toast.loading("Submitting your message...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      contactEndpoints.CONTACT_US_API,
      formData
    );
    if (!response?.data?.success) {
      throw new Error("Could not submit contact form.");
    }
    result = response.data;
    toast.success("Message sent successfully!");
  } catch (error) {
    console.log("CONTACT_US_API ERROR:", error);
    toast.error(error.message || "Failed to submit contact form");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};