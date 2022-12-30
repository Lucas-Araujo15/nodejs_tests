import { Statement } from "../../../../modules/statements/entities/Statement";

export class TransferViewModel {
  static toHTTP(transfer: Statement) {
    return {
      id: transfer.id,
      sender_id: transfer.user_id,
      amount: transfer.amount,
      description: transfer.description,
      type: "teste",
      created_at: transfer.created_at,
      updated_at: transfer.updated_at,
    };
  }
}
