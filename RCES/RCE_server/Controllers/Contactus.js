const { contactUsEmail } = require("../Mail/template/contactFormRes");
const mailSender = require("../Utils/mailSender");

// ✅ Contact Us Controller
exports.contactUsController = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    // Send confirmation email to the user
    const userEmailContent = contactUsEmail(name);
    await mailSender(email, "Thank you for contacting us!", userEmailContent);

    // Send the contact message to the admin/support team
    const adminEmailContent = `
      <h3>New Contact Us Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;
    await mailSender(process.env.ADMIN_EMAIL, "New Contact Us Message", adminEmailContent);

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully. We will get back to you soon.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while sending your message.",
      error: err.message,
    });
  }
};