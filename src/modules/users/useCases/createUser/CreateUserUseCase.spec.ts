import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "usertest@email.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user that already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "usertest@email.com",
        password: "123456",
      });

      await createUserUseCase.execute({
        name: "User Test",
        email: "usertest@email.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
