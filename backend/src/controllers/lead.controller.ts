import { Parser } from "json2csv";
import { Request, Response } from "express";

import Lead from "../models/Lead.model";

import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";

import {
  createLeadSchema,
  updateLeadSchema,
} from "../validations/lead.validation";

export const createLead = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData =
      createLeadSchema.parse(req.body);

    const lead = await Lead.create(
      validatedData
    );

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  }
);

export const getLeads = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;

    const limit = 10;

    const skip = (page - 1) * limit;

    const search =
      (req.query.search as string) || "";

    const status =
      (req.query.status as string) || "";

    const source =
      (req.query.source as string) || "";

    const sort =
      (req.query.sort as string) || "latest";

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const sortOption: { createdAt: 1 | -1 } =
  sort === "oldest"
    ? { createdAt: 1 }
    : { createdAt: -1 };

    const totalLeads =
      await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total: totalLeads,
      currentPage: page,
      totalPages: Math.ceil(
        totalLeads / limit
      ),
      leads,
    });
  }
);

export const getSingleLead = asyncHandler(
  async (req: Request, res: Response) => {
    const lead = await Lead.findById(
      req.params.id
    );

    if (!lead) {
      throw new AppError(
        "Lead not found",
        404
      );
    }

    res.status(200).json({
      success: true,
      lead,
    });
  }
);

export const updateLead = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData =
      updateLeadSchema.parse(req.body);

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      validatedData,
      {
        new: true,
      }
    );

    if (!lead) {
      throw new AppError(
        "Lead not found",
        404
      );
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead,
    });
  }
);

export const deleteLead = asyncHandler(
  async (req: Request, res: Response) => {
    const lead = await Lead.findByIdAndDelete(
      req.params.id
    );

    if (!lead) {
      throw new AppError(
        "Lead not found",
        404
      );
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  }
);
export const exportLeadsCSV = asyncHandler(
  async (_req: Request, res: Response) => {
    const leads = await Lead.find();

    const fields = [
      "name",
      "email",
      "status",
      "source",
      "createdAt",
    ];

    const json2csvParser = new Parser({
      fields,
    });

    const csv =
      json2csvParser.parse(leads);

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment("leads.csv");

    return res.send(csv);
  }
);