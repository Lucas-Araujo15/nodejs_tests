import { TransferViewModel } from "../../../shared/infra/http/viewModels/TransferViewModel";
import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({
    statement,
    balance,
  }: {
    statement: Statement[];
    balance: number;
  }) {
    const parsedStatement = statement.map((statement) => {
      if (statement.type.toString() === "transfer") {
        return TransferViewModel.toHTTP(statement);
      }
      return statement;
    });

    return {
      statement: parsedStatement,
      balance: Number(balance),
    };
  }
}
