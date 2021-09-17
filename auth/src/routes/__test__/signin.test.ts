import request from "supertest";
import { app } from "../../app";

it("fails login attempt with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);
});

it("fails login attempt with invalid password", async () => {
  request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test123",
    })
    .expect(400);
});

it("sets cookie after signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
