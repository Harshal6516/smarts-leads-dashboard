import mongoose, { Schema } from "mongoose";

import { ILead } from "../types/lead.types";

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost"],
      default: "New",
    },

    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model<ILead>(
  "Lead",
  leadSchema
);

export default Lead;