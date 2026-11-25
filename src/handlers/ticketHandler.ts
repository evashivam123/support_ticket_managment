import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { ticketService } from "../application/ticketService.js";
import { isValidId, validateCreateTicket, validateUpdateTicket } from "../utils/ticketValidator.js";

export class TicketHandler {
  async create(req: AuthenticatedRequest, res: Response) {
    const validation = validateCreateTicket(req);
    if (!validation.valid) return res.status(400).json({ message: validation.error });
    try {
      const ticket = await ticketService.create(req.auth!.userId, validation.data);
      return res.status(201).json({ message: "Ticket created successfully", ticket });
    } catch (error) {
      console.error("Create ticket error:", error);
      return res.status(500).json({ message: "Unable to create ticket" });
    }
  }

  async list(req: AuthenticatedRequest, res: Response) {
    try {
      return res.json({ tickets: await ticketService.list(req.auth!.userId) });
    } catch (error) {
      console.error("List tickets error:", error);
      return res.status(500).json({ message: "Unable to fetch tickets" });
    }
  }

  async get(req: AuthenticatedRequest, res: Response) {
    const id = this.getTicketId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid ticket id" });
    try {
      const ticket = await ticketService.get(id, req.auth!.userId);
      return ticket ? res.json({ ticket }) : res.status(404).json({ message: "Ticket not found" });
    } catch (error) {
      console.error("Get ticket error:", error);
      return res.status(500).json({ message: "Unable to fetch ticket" });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const id = this.getTicketId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid ticket id" });
    const validation = validateUpdateTicket(req);
    if (!validation.valid) return res.status(400).json({ message: validation.error });
    try {
      const ticket = await ticketService.update(id, req.auth!.userId, validation.data);
      return ticket ? res.json({ message: "Ticket updated successfully", ticket })
        : res.status(404).json({ message: "Ticket not found" });
    } catch (error) {
      console.error("Update ticket error:", error);
      return res.status(500).json({ message: "Unable to update ticket" });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    const id = this.getTicketId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid ticket id" });
    try {
      const ticket = await ticketService.delete(id, req.auth!.userId);
      return ticket ? res.json({ message: "Ticket deleted successfully" })
        : res.status(404).json({ message: "Ticket not found" });
    } catch (error) {
      console.error("Delete ticket error:", error);
      return res.status(500).json({ message: "Unable to delete ticket" });
    }
  }

  private getTicketId(value: string | string[] | undefined) {
    return typeof value === "string" && isValidId(value) ? value : undefined;
  }
}

export const ticketHandler = new TicketHandler();
