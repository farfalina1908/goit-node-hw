import express from "express"
import request from "supertest";
import "dotenv/config";
import authController from "./auth-controller.js"
import app from "../app.js";
import mongoose from "mongoose";
import User from "../models/User.js";



const { DB_TEST_HOST, PORT = 3000 } = process.env;

describe("test /users /register route", () => {
  let server = null
  beforeAll(async () => { 
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(3000)
  })
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
  afterEach(async () => {
    await User.deleteMany();
     
  });

  test("should users/register a new user successfully", async () => {
    const signupData = {
      email: "test@example.com",
      password: "testpassword",
    }
    const {body, statusCode } = await request(app)
      .post("/users/register")
      .send(signupData)
    
    expect(statusCode).toBe(201);
    expect(body.email).toBe(signupData.email);
    const user = await User.findOne({ email: signupData.email })
    expect(user.email).toBe(signupData.email);

  expect(body.password).toBe(signupData.password);
  })
  
})
 



// describe("Signup Controller Tests", () => {
//     it("should signup a new user successfully", async () => {
//       const userData = {
//         email: "test@example.com",
//         password: "testpassword",
//       };
  
//       const response = await request(app)
//          .post("/register")
//          .send(userData)
//          .expect(201);
  
//       expect(response.body).toHaveProperty("token");
//       expect(typeof response.body.token).toBe("string");
  
//       expect(response.body).toHaveProperty("user");
//       expect(typeof response.body.user.email).toBe("string");
//       expect(typeof response.body.user.subscription).toBe("string");
//     });
  
//     it("should return 409 if email is already in use", async () => {
//       const existingUser = {
//         email: "existing@example.com",
//         password: "existingpassword",
//       };
  
//       // Assume existing user is already signed up
//       await request(app).post("/register").send(existingUser).expect(201);
  
//       const response = await request(app)
//          .post("/register")
//          .send(existingUser)
//          .expect(409);
  
//       expect(response.body).toHaveProperty("message", "Email already in use");
//     });
  
    
//   });