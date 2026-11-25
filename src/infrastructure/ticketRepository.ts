import { Types } from "mongoose";
import Ticket, { type ITicket, type TicketStatus } from "../models/Ticket.js";

export type NewTicket = Pick<ITicket, "name" | "description" | "user_id"> & { status?: TicketStatus };
export type TicketUpdates = Partial<Pick<ITicket, "name" | "description" | "status">>;

export class TicketRepository {
  create(ticket: NewTicket) {
    return Ticket.create(ticket);
  }

  findForUser(userId: string) {
    return Ticket.find({ user_id: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  findByIdForUser(ticketId: string, userId: string) {
    return Ticket.findOne({ _id: ticketId, user_id: new Types.ObjectId(userId) });
  }

  updateForUser(ticketId: string, userId: string, updates: TicketUpdates) {
    return Ticket.findOneAndUpdate(
      { _id: ticketId, user_id: new Types.ObjectId(userId) },
      { $set: updates },
      { new: true, runValidators: true },
    );
  }

  deleteForUser(ticketId: string, userId: string) {
    return Ticket.findOneAndDelete({ _id: ticketId, user_id: new Types.ObjectId(userId) });
  }
}

export const ticketRepository = new TicketRepository();
