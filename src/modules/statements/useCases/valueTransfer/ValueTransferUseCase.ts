import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { IValueTransferDTO } from "./IValueTransferDTO";

@injectable()
class ValueTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    receiver_id,
    sender_id,
  }: IValueTransferDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(sender_id);
    const receiver = await this.usersRepository.findById(receiver_id);

    if (!user) {
      throw new AppError("User does not exist!");
    }

    if (!receiver) {
      throw new AppError("Receiver does not exist!");
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (amount > balance) {
      throw new AppError("The user doesn't have enough balance!");
    }

    await this.statementsRepository.create({
      amount,
      description,
      user_id: sender_id,
      type: "deposit" as OperationType,
    });

    const transfer = await this.statementsRepository.create({
      amount,
      description,
      user_id: sender_id,
      type: "transfer" as OperationType,
    });

    return transfer;
  }
}

export { ValueTransferUseCase };
