import * as url from "url";
import { MailService } from "@sendgrid/mail";

const sendgridClient = new MailService();

export const sendEmailForVerification = async (email, verificationCode) => {
  const emailData = {
    from: process.env.SENDGRID_USER,
    to: email,
    subject: `${process.env.PLATFORM_NAME} Platform: Email Verification`,
    content: emailTemplate(email, verificationCode),
  };
  try {
    const isEmailSent = await sendEmail(emailData);
    return isEmailSent;
  } catch (err) {
    console.error(" Error while sending mail in sendgrid", err);
    return false;
  }
};

export const sendEmail = async (emailData) => {
  sendgridClient.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: emailData.to,
    from: emailData.from,
    subject: emailData.subject,
    text: emailData.text,
    html: emailData.content,
    attachments: emailData.emailAttachments,
  };
  return await sendgridClient
    .send(msg)
    .then(() => true)
    .catch(() => false);
  // console.log(emailData);
  // return true
};

const emailTemplate = (email, verificationCode) => {
  const endpoint = `${process.env.FRONT_END_URL}`;
  const apiUrl = url.parse(
    `${endpoint}/verify-email-success?verificationCode=${verificationCode}&email=${encodeURIComponent(
      email
    )}`
  );
  const validUrl = apiUrl.href.replace("/:", ":");

  return `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <title></title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            
            <body>
                        <p style="margin-top:0px">
                            Hello ${email} ,
                        </p>
                        <p>
                        Your user account ${email} has been successfully created on ${process.env.PLATFORM_NAME}. In order to enable access for your account,
                         we need to verify your email address. Please use the link below or click on the “Verify” button to enable access to your account.
                         </p>
                        <div style="text-align: center; padding-bottom: 20px;">
                            <a clicktracking=off href="${validUrl}"
                                style="padding: 10px 20px 10px 20px;color: #fff;background: #1F4EAD;border-radius: 5px;text-decoration: none;">
                                VERIFY
                            </a>
                        </div>
                    </div>
                </div>
            </body>
            </html>`;
};
