const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.RESEND_FROM_EMAIL
  ) {
    const errorMessage =
      "RESEND_API_KEY or RESEND_FROM_EMAIL is missing.";

    console.error(errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }

  const emailHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
      <h2>ZeroVerse Verification</h2>

      <p>Your OTP is:</p>

      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 6px;
        margin: 20px 0;
      ">
        ${otp}
      </div>

      <p>This OTP is valid for 10 minutes.</p>

      <p>If you didn't request this email, you can ignore it.</p>
    </div>
  `;

  const emailText = `
ZeroVerse Verification

Your OTP is: ${otp}

This OTP is valid for 10 minutes.

If you didn't request this email, you can ignore it.
`;

  try {
    const { data, error } = await resend.emails.send({
      from: `ZeroVerse <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "ZeroVerse Email Verification",
      html: emailHTML,
      text: emailText,
    });

    if (error) {
      console.error("Resend Error:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ OTP email sent:", data?.id);

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Resend Exception:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
};