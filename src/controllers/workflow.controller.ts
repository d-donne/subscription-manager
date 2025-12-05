import { WorkflowContext } from "@upstash/workflow";
import { serve } from "@upstash/workflow/express";
import Subscription from "../database/models/subscription.model";
import dayjs from "dayjs";
import { logMessage } from "../middlewares/logger.middleware";
import { SERVER_URL } from "../config/env";
import { sendReminderEmail } from "../utils/send-email";
import { generateReminderType, ReminderTypes } from "../utils/reminder-email-template";

const reminders = [7, 5, 2, 1];

export const handleSendReminders = serve(
  async (context: WorkflowContext<{ subscriptionId: string }>) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== "active") return;

    const { renewalDate } = subscription;

    logMessage(` ${dayjs(renewalDate).diff(dayjs(), "day")} days remaining for subscription ${subscriptionId} from today(${dayjs().format("MMMM D, YYYY")})`);

    if (dayjs(renewalDate).isBefore(dayjs())) {
      logMessage(`Renewal date (${dayjs(renewalDate).format("MMMM D, YYYY")}) passed for subscription ${subscriptionId}, no reminder sent. Stopping workflow.`);
      return;
    }

    for (const daysBefore of reminders) {
      const reminderDate = dayjs(renewalDate).subtract(daysBefore, "day");
      const now = dayjs();

      const label = generateReminderType(daysBefore);
      if (!label) continue;

      if (reminderDate.isAfter(now)) {
        await sleepUntilReminder(context, label, reminderDate);
      }

      if (now.isSame(reminderDate, "day")) {
        await triggerReminder(context, label, subscription);
      }
    }
  },
  {
    url: `${SERVER_URL}/api/workflows/subscription/reminder`,
  }
);

const fetchSubscription = async (context: WorkflowContext, subscriptionId: string) => {
  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context: WorkflowContext, label: ReminderTypes, reminderDate: dayjs.Dayjs) => {
  logMessage(`Sleeping until ${label}: ${reminderDate.format("dddd, MMMM D, YYYY")}`);
  await context.sleepUntil(label, reminderDate.toDate());
};

const triggerReminder = async (context: WorkflowContext, label: ReminderTypes, subscription: any) => {
  return await context.run(label, async () => {
    logMessage(`Trigger ${label} reminder`);
    // run reminder logic (send email, etc)
    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};
