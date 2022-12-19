import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuid } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;
describe("Get Statement Operation", () => {
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

  it("should be able to get a statement operation", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usertest@email.com",
      password: "testing",
    });

    const { token } = responseToken.body;

    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(deposit.body.id);
  });
});
