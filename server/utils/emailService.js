const nodemailer = require("nodemailer");

// Create a transporter using Gmail
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_APP_PASSWORD;

  // Debug: Check if credentials are loaded
  if (!emailUser || !emailPass) {
    console.error("Email credentials missing!");
    console.error("EMAIL_USER:", emailUser);
    console.error("EMAIL_APP_PASSWORD:", emailPass ? "SET" : "MISSING");
    throw new Error(
      "Email credentials not configured. Please check your .env file."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "ZeroVerse",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Email Verification - ZeroVerse",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              color: #4F46E5;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .otp-box {
              background-color: #4F46E5;
              color: white;
              font-size: 32px;
              font-weight: bold;
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
              letter-spacing: 8px;
            }
            .info {
              color: #666;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <div class="logo">⚡ ZeroVerse</div>
                <h2 style="color: #333; margin: 0;">Email Verification</h2>
              </div>
              
              <p>Hello,</p>
              <p>Thank you for signing up with ZeroVerse! To complete your registration, please verify your college email address.</p>
              
              <p>Your One-Time Password (OTP) is:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p class="info">
                ⏰ This OTP is valid for <strong>10 minutes</strong>.<br>
                🔒 Do not share this code with anyone.<br>
                ❓ If you didn't request this, please ignore this email.
              </p>
              
              <div class="footer">
                <p>This is an automated email from ZeroVerse. Please do not reply.</p>
                <p>&copy; ${new Date().getFullYear()} ZeroVerse - Anonymous Campus Community</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ZeroVerse - Email Verification
        
        Your OTP for email verification is: ${otp}
        
        This OTP is valid for 10 minutes.
        Do not share this code with anyone.
        
        If you didn't request this, please ignore this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
};
