import { Router } from "express";
import { sortTicket } from "../controllers/ticket.controller.js";

const router = Router();

router.post("/sort-ticket", sortTicket);

export default router;
