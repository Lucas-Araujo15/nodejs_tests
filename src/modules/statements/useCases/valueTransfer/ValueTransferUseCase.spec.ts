import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { ValueTransferUseCase } from "./ValueTransferUseCase";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let valueTransferUseCase: ValueTransferUseCase;

describe("Value Transfer", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    valueTransferUseCase = new ValueTransferUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("should be able to create a new transfer", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "hunemjet@wijow.bm",
      name: "Estella Bridges",
      password: "620138",
    });

    const receiver = await usersRepositoryInMemory.create({
      email: "nizeb@pinilru.af",
      name: "Anthony Gonzales",
      password: "055527",
    });

    await statementsRepositoryInMemory.create({
      user_id: user.id,
      amount: 100,
      description: "xhInzVMdZT",
      type: "deposit" as OperationType,
    });

    const transfer = await valueTransferUseCase.execute({
      sender_id: user.id,
      receiver_id: receiver.id,
      amount: 50,
      description: "aWbIqSuCnSUAyFfnRzyT",
    });

    expect(transfer).toHaveProperty("id");
  });

  it("should not be able to transfer values greater than a balance", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "usrogne@volejjub.pf",
      name: "Theresa Perez",
      password: "478796",
    });

    const receiver = await usersRepositoryInMemory.create({
      email: "cedir@kecwi.mz",
      name: "Herman Maxwell",
      password: "946849",
    });

    await statementsRepositoryInMemory.create({
      user_id: user.id,
      amount: 100,
      description: "xhInzVMdZT",
      type: "deposit" as OperationType,
    });

    await expect(
      valueTransferUseCase.execute({
        sender_id: user.id,
        receiver_id: receiver.id,
        amount: 200,
        description: "aWbIqSuCnSUAyFfnRzyT",
      })
    ).rejects.toEqual(new AppError("The user doesn't have enough balance!"));
  });
});
