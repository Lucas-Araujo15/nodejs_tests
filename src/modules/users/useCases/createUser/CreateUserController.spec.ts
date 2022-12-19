import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;
describe("Create a new user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Integration Test - User",
      email: "integrationtest@email.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });
});
