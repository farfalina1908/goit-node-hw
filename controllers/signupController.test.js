import express from "express"
import request from "supertest";
import authController from "./auth-controller.js"

describe("Signup Controller Tests", () => {
    it("should signup a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "testpassword",
      };
  
      const response = await request(app)
        .post("/signup")
        .send(userData)
        .expect(201);
  
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
  
      expect(response.body).toHaveProperty("user");
      expect(typeof response.body.user.email).toBe("string");
      expect(typeof response.body.user.subscription).toBe("string");
    });
  
    it("should return 409 if email is already in use", async () => {
      const existingUser = {
        email: "existing@example.com",
        password: "existingpassword",
      };
  
      // Assume existing user is already signed up
      await request(app).post("/signup").send(existingUser).expect(201);
  
      const response = await request(app)
        .post("/signup")
        .send(existingUser)
        .expect(409);
  
      expect(response.body).toHaveProperty("message", "Email already in use");
    });
  
    
  });