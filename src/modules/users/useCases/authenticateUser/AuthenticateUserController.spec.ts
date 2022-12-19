import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;
describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("testing", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
            values('${id}', 'user_test', 'usertest@email.com', '${password}', 'now()', 'now()')
        `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "usertest@email.com",
      password: "testing",
    });

    expect(response.body).toHaveProperty("token");
  });
});
