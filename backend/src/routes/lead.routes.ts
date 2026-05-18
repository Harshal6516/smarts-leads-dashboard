import express from "express";

import {
  createLead,
  getLeads,
  getSingleLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from "../controllers/lead.controller";

import {
  protect,
  authorizeRoles,
} from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  authorizeRoles("admin", "sales"),
  createLead
);

router.get(
  "/",
  authorizeRoles("admin", "sales"),
  getLeads
);

router.get(
  "/export/csv",
  authorizeRoles("admin","sales"),
  exportLeadsCSV
);

router.get(
  "/:id",
  authorizeRoles("admin", "sales"),
  getSingleLead
);

router.put(
  "/:id",
  authorizeRoles("admin", "sales"),
  updateLead
);

router.delete(
  "/:id",
  authorizeRoles("admin","sales"),
  deleteLead
);

export default router;