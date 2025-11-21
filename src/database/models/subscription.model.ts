import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price cannot be negative"],
      max: [1000, "Price cannot exceed 1000"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "GHS"],
      default: "GHS",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: [true, "Subscription frequency is required"],
    },
    category: {
      type: String,
      enum: ["sports", "news", "entertainment", "education", "productivity", "technology"],
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "mobile_money"],
    },
    startDate: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value: Date) {
          return value <= new Date();
        },
        message: "Start date cannot be in the future",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (this: any, value: Date) {
          return !value || value > this.startDate;
        },
        message: "Renewal date must be after start date",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "canceled", "expired"],
      default: "active",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

const renewalPeriods: { [key: string]: number } = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  yearly: 365,
};

//autocalculate renewalDate if missing
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }

  // if renewal date is before start date, set status to expired
  if (this.renewalDate < this.startDate) {
    this.status = "expired";
  }
  next();
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
