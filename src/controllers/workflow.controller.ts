import { WorkflowContext } from "@upstash/workflow";
import { serve } from "@upstash/workflow/express";
import Subscription from "../database/models/subscription.model";
import dayjs from "dayjs";
import { logMessage } from "../middlewares/logger.middleware";
import { SERVER_URL } from "../config/env";

const reminders = [7, 3, 1];

export const handleSendReminders = serve(
  async (context: WorkflowContext<{ subscriptionId: string }>) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== "active") return;

    const { renewalDate } = subscription;

    if (dayjs(renewalDate).isBefore(dayjs())) {
      logMessage(`Renewal date passed for subscription ${subscriptionId}, no reminder sent. Stopping workflow.`);
      return;
    }

    for (const daysBefore of reminders) {
      const reminderDate = dayjs(renewalDate).subtract(daysBefore, "day");
      const now = dayjs();

      if (reminderDate.isAfter(now)) {
        await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
      }

      await triggerReminder(context, `Reminder ${daysBefore} days before`);
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

const sleepUntilReminder = async (context: WorkflowContext, label: string, reminderDate: dayjs.Dayjs) => {
  logMessage(`Sleeping until ${label} reminder date: ${reminderDate}`);
  await context.sleepUntil(label, reminderDate.toDate());
};

const triggerReminder = async (context: WorkflowContext, label: string) => {
  return await context.run(label, () => {
    logMessage(`Trigger ${label} reminder`);
    // run reminder logic (send email, etc)
  });
};
