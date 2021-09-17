import request from "supertest";
import { app } from "../../app";

it("return 201 status code on sucess", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);
});

it("return 400 status code with invalid email", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "test",
    })
    .expect(400);
});

it("return 400 status code with invalid password", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "t",
    })
    .expect(400);
});

it("return 400 status code with missing email or password", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "",
    })
    .expect(400);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "test",
    })
    .expect(400);
});

it("disallows duplicate email", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(400);
});

it("sets cookie after signup", async () => {
  let response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
