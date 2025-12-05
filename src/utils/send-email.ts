import { DevError } from "../middlewares/error.middleware";
import { EmailTemplateData, emailTemplates, ReminderTypes } from "./reminder-email-template";
import dayjs from "dayjs";
import nodemailer from "nodemailer";
import { EMAIL_USER } from "../config/env";
import { transporter } from "../config/nodemailer";
import { logMessage } from "../middlewares/logger.middleware";

type SendReminderEmailParams = {
  to: string;
  type: ReminderTypes;
  subscription: any;
};

export const sendReminderEmail = ({ to, type, subscription }: SendReminderEmailParams) => {
  if (!to || !type) {
    throw DevError("sendReminderEmail", "Missing to or type parameter");
  }

  const template = emailTemplates.find((t) => t.label === type);
  if (!template) {
    throw DevError("sendReminderEmail", `No email template found for type: ${type}`);
  }

  const mailInfo: EmailTemplateData = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMMM D, YYYY"),
    planName: subscription.planName,
    price: `${subscription.currency}${subscription.price.toFixed(2)} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  };

  const mailOptions: nodemailer.SendMailOptions = {
    from: EMAIL_USER,
    to,
    subject: template.generateSubject(mailInfo),
    html: template.generateBody(mailInfo),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw DevError("sendReminderEmail", `Error sending email: ${error.message}`);
    } else {
      logMessage(`Email sent: ${info.response}`);
    }
  });
};
