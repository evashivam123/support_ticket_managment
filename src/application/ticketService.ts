import { Types } from "mongoose";
import { ticketRepository, type TicketRepository, type TicketUpdates } from "../infrastructure/ticketRepository.js";
import type { TicketStatus } from "../models/Ticket.js";

export class TicketService {
  constructor(private readonly tickets: TicketRepository = ticketRepository) {}

  create(userId: string, input: { name: string; description: string; status?: TicketStatus }) {
    return this.tickets.create({ ...input, user_id: new Types.ObjectId(userId) });
  }

  list(userId: string) {
    return this.tickets.findForUser(userId);
  }

  get(ticketId: string, userId: string) {
    return this.tickets.findByIdForUser(ticketId, userId);
  }

  update(ticketId: string, userId: string, updates: TicketUpdates) {
    return this.tickets.updateForUser(ticketId, userId, updates);
  }

  delete(ticketId: string, userId: string) {
    return this.tickets.deleteForUser(ticketId, userId);
  }
}

export const ticketService = new TicketService();
