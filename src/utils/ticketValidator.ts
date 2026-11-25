import type { Request } from "express";
import { TICKET_STATUSES, type TicketStatus } from "../models/Ticket.js";

export type CreateTicketInput = { name: string; description: string; status?: TicketStatus };
export type UpdateTicketInput = Partial<CreateTicketInput>;
export type ValidationResult<T> = { valid: true; data: T } | { valid: false; error: string };

export function validateCreateTicket(req: Request): ValidationResult<CreateTicketInput> {
  const { name, description, status } = req.body ?? {};
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120) {
    return { valid: false, error: "name must be between 2 and 120 characters" };
  }
  if (typeof description !== "string" || !description.trim() || description.trim().length > 5000) {
    return { valid: false, error: "description is required and must be at most 5000 characters" };
  }
  if (status !== undefined && !TICKET_STATUSES.includes(status)) {
    return { valid: false, error: `status must be one of: ${TICKET_STATUSES.join(", ")}` };
  }
  return { valid: true, data: { name: name.trim(), description: description.trim(), ...(status ? { status } : {}) } };
}

export function validateUpdateTicket(req: Request): ValidationResult<UpdateTicketInput> {
  const { name, description, status } = req.body ?? {};
  const updates: UpdateTicketInput = {};
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120) {
      return { valid: false, error: "name must be between 2 and 120 characters" };
    }
    updates.name = name.trim();
  }
  if (description !== undefined) {
    if (typeof description !== "string" || !description.trim() || description.trim().length > 5000) {
      return { valid: false, error: "description must be non-empty and at most 5000 characters" };
    }
    updates.description = description.trim();
  }
  if (status !== undefined) {
    if (!TICKET_STATUSES.includes(status)) {
      return { valid: false, error: `status must be one of: ${TICKET_STATUSES.join(", ")}` };
    }
    updates.status = status;
  }
  if (Object.keys(updates).length === 0) return { valid: false, error: "Provide at least one valid field to update" };
  return { valid: true, data: updates };
}

export function isValidId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}
