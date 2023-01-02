import { Statement } from "../../../../modules/statements/entities/Statement";

export class TransferViewModel {
  static toHTTP(statement: Statement) {
    return {
      id: statement.id,
      sender_id: statement.user_id,
      amount: statement.amount,
      description: statement.description,
      type: statement.type,
      created_at: statement.created_at,
      updated_at: statement.updated_at,
    };
  }
}
