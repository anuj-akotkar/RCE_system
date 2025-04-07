const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../Utils/mailSender");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;

  try {
    const emailResponse = await mailSender(
      email,
      "Your message was received - Coding Contest Platform",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    console.log("Contact Form Email Response:", emailResponse);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.log("Error sending contact form:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message. Please try again later.",
    });
  }
};
