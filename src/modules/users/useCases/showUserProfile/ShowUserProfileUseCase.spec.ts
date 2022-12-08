import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show Profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to list the current user information ", async () => {
    const user = await createUserUseCase.execute({
      name: "User Profile Test",
      email: "userprofiletest@email.com",
      password: "123456",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toEqual(user);
  });

  it("should not be able to list information from a non-existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("12345");
    }).rejects.toBeInstanceOf(AppError);
  });
});
