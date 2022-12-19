import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "./CreateStatementController";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Make a statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      email: "usertest@email.com",
      password: "12345",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 200,
      description: "Deposit test",
    });

    expect(deposit).toHaveProperty("id");
  });

  it("should be able to create a new withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      email: "usertest@email.com",
      password: "12345",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit test",
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user.id,
      type: "withdraw" as OperationType,
      amount: 10,
      description: "Withdraw test",
    });

    expect(withdraw).toHaveProperty("id");
  });
});
