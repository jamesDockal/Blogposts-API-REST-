// library to make the request to the API
import request from "supertest";

// URL of the api
const server = request("http://localhost:3000");

class MockUser {
  username: string;
  password: string;
  constructor() {
    this.username = "any_username";
    this.password = "any_username";
  }
}

class adminUser {
  username: string;
  password: string;
  token: string;
  constructor() {
    this.username = "admin";
    this.password = "admin";
    this.token =
      "eyJhbGciOiJIUzI1NiJ9.MTliMDRjNDgtNzI2MC00ZjVjLTg1ZDAtZmMzMmVlNTQ4M2M2.GgaAMTpcS7Uj1X3plAx1W3SIj__fkL5zXXc4PeEeSTk";
  }
}

describe("Register", () => {
  it("should see if the password was NOT provided", async () => {
    const user = { username: "teste_username" };

    // it gonna make the request, but gonna return a error on the UserMiddleware passedCrendentials
    // because no password passed was provided
    const response = await server.post("/user/register").send(user);

    expect(response.status).toBe(400);
  });
  it("should see if the username was NOT provided", async () => {
    const user = { password: "teste_password" };

    // it gonna make the request, but gonna return a error, status 400, on the UserMiddleware passedCrendentials
    // because no email was provided
    const response = await server.post("/user/register").send(user);

    expect(response.status).toBe(400);
  });
  it("should NOT created an user if the username is alredy in use", async () => {
    // this is the default user
    // that was created in the migration
    const user = {
      username: "admin",
      password: "anypassword",
    };

    // it gonna return a error, status 400, becuase the user alredy exist on the database
    const response = await server.post("/user/register").send(user);

    expect(response.status).toBe(400);
  });
});

describe("login", () => {
  it("should see if the password was NOT provided", async () => {
    const user = { username: "teste_username" };

    // it gonna make the request, but gonna return a error on the UserMiddleware passedCrendentials
    // because no password passed was provided
    const response = await server.post("/user/login").send(user);

    expect(response.status).toBe(400);
  });
  it("should see if the username was NOT provided", async () => {
    const user = { password: "teste_password" };

    // it gonna make the request, but gonna return a error, status 400, on the UserMiddleware passedCrendentials
    // because no email was provided
    const response = await server.post("/user/login").send(user);

    expect(response.status).toBe(400);
  });
  it("should see if the user NOT exists", async () => {
    const user = {
      username: "username_not_cadastred",
      password: "any_password",
    };

    const response = await server.post("/user/login").send(user);

    expect(response.status).toBe(400);
  });
  it("should see if the user alredy exists", async () => {
    const user = {
      username: "admin",
      password: "admin",
    };

    const response = await server.post("/user/login").send(user);

    expect(response.status).toBe(200);
  });
  it("should to validate a wrong password", async () => {
    const user = {
      username: "admin",
      password: "wrong_password",
    };

    const response = await server.post("/user/login").send(user);

    expect(response.status).toBe(401);
  });
});

describe("Loged routes", () => {
  it("should return a error if no token on header was provided", async () => {
    const user = new MockUser();

    const response = await server.post("/user/test").send(user);

    expect(response.status).toBe(401);
  });

  it("should return a error if the token does not have the word 'Bearer'", async () => {
    const user = new MockUser();

    const response = await server
      .post("/user/test")
      .send(user)
      .set({ authorization: "teste" });

    expect(response.status).toBe(400);
  });
  it("should see return ok with pass a valid token", async () => {
    const user = new adminUser();

    const response = await server
      .post("/user/test")
      .send(user)
      .set({ authorization: `Bearer ${user.token}` });

    expect(response.status).toBe(200);
  });
});

describe("blogpost", () => {
  it("should not pass with lack of information", async () => {
    const blogpost = {};

    const response = await server.post("/blogpost/create").send(blogpost);

    expect(response.status).toBe(400);
  });
  it("should not see if it's a valid user_id", async () => {
    const blogpost = {
      title: "teste",
      content: "teste",
      slug: "teste",
      created_by: "invalid user_id",
    };

    const response = await server.post("/blogpost/create").send(blogpost);

    expect(response.status).toBe(406);
  });
});
