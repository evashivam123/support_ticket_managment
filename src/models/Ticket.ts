import mongoose, { type Model, Schema, Types } from "mongoose";

export const TICKET_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface ITicket {
  name: string;
  description: string;
  status: TicketStatus;
  user_id: Types.ObjectId;
}

class TicketClass {
  declare name: string;
  declare description: string;
  declare status: TicketStatus;
  declare user_id: Types.ObjectId;
}

const ticketSchema = new Schema<ITicket>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: TICKET_STATUSES, default: "open", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

ticketSchema.loadClass(TicketClass);

const Ticket = (mongoose.models.Ticket as Model<ITicket> | undefined)
  ?? mongoose.model<ITicket>("Ticket", ticketSchema);

export default Ticket;
