/**
 * Email Service
 * Handles sending verification emails with support for both development and production
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const { to, subject, html, text } = options;

  // In development or when no email service is configured, log to console
  if (process.env.NODE_ENV === "development" || !process.env.EMAIL_SERVICE_API_KEY) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                        EMAIL SENT                              ║
╠════════════════════════════════════════════════════════════════╣
║ To: ${to.padEnd(56)} ║
║ Subject: ${subject.padEnd(52)} ║
╠════════════════════════════════════════════════════════════════╣
${text || html}
╚════════════════════════════════════════════════════════════════╝
    `);
    return;
  }

  // Production: Use Resend or SendGrid
  // For now, we'll use Resend as it's simpler and recommended
  try {
    if (process.env.EMAIL_SERVICE === "resend") {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.EMAIL_SERVICE_API_KEY);
      
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "IUO Archive <noreply@iuo.edu>",
        to,
        subject,
        html,
        text,
      });
    } else if (process.env.EMAIL_SERVICE === "sendgrid") {
      const sgMail = await import("@sendgrid/mail");
      sgMail.setApiKey(process.env.EMAIL_SERVICE_API_KEY);
      
      await sgMail.send({
        from: process.env.EMAIL_FROM || "IUO Archive <noreply@iuo.edu>",
        to,
        subject,
        html,
        text,
      });
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    // In production, you might want to throw or handle this differently
    // For now, we'll log it and continue (graceful degradation)
    throw new Error("Failed to send email. Please try again later.");
  }
}

export function createVerificationEmailHtml(
  email: string,
  verificationUrl: string,
  vaultId: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - IUO Student Archive</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">IUO Student Archive</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
    
    <p>Hello,</p>
    
    <p>Thank you for signing up for IUO Student Archive! To complete your registration, please verify your email address by clicking the button below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email Address</a>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
      <p style="margin: 0 0 10px 0; font-weight: bold;">Your Vault ID:</p>
      <p style="margin: 0; font-family: monospace; font-size: 18px; color: #667eea; font-weight: bold;">${vaultId}</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Save this ID! You'll need it to log in after verification.</p>
    </div>
    
    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
    
    <p style="font-size: 12px; color: #666; margin-top: 30px;">
      This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #999; text-align: center;">
      © ${new Date().getFullYear()} IUO Student Archive. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();
}

export function createVerificationEmailText(
  email: string,
  verificationUrl: string,
  vaultId: string
): string {
  return `
IUO Student Archive - Email Verification

Hello,

Thank you for signing up for IUO Student Archive! To complete your registration, please verify your email address by visiting the link below:

${verificationUrl}

Your Vault ID: ${vaultId}
Save this ID! You'll need it to log in after verification.

This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.

© ${new Date().getFullYear()} IUO Student Archive. All rights reserved.
  `.trim();
}

