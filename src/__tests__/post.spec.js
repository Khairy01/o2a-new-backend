const supertest = require('supertest');

const {app, server} = require('../server');

const UserModel = require('../models/user.model');
const PostModel = require('../models/post.model');

const request = supertest(app);

const baseURL = "http://localhost:5000/api/post";


describe("API Post", () => {
   
  const user = new UserModel({
    first_name: "ami",
    last_name: "ndiaye",
    address: "Parcelles Assainies",
    email: "ndami@gmail.com",
    user_name: "@ami",
    password: "ami123"
  });
  user.save();

  const user2 = new UserModel({
    first_name: "Amy",
    last_name: "sene",
    address: "Parcelles Assainies",
    email: "amy@gmail.com",
    user_name: "@amy",
    password: "amy123"
  });

  user2.save();

  const post = new PostModel({
    posterId: user._id,
    message: "Welcome world !"
  });
  post.save();
 
    it("Should create a new public post and return a 201 status code", async () => {
    
      const response = await request(baseURL).post("/public-post").send({
        posterId:user2._id,
        message : "Hello, world !"
      });
      expect(response.status).toEqual(201);
    });
    it("Should create a new private post and return a 201 status code", async () => {
      const user = new UserModel({
        first_name: "moussa",
        last_name: "sene",
        address: "Parcelles Assainies",
        email: "mous@gmail.com",
        user_name: "@msene",
        password: "senem123"
      });
      await user.save();
      const response = await request(baseURL).post("/private-post").send({
        posterId: user._id,
        message : "Hello, doctor !"
      });
      expect(response.status).toBe(201);
    });

    it("Should update a given post and return a 200 status code", async () => {
      const user = new UserModel({
        first_name: "maty",
        last_name: "sy",
        address: "Parcelles Assainies",
        email: "symaty@gmail.com",
        user_name: "@matysy",
        password: "symaty123"
      });
      await user.save();

      const post = new PostModel({
        posterId: user._id,
        message: "Welcome world !"
      });
      await post.save();
  
      const response = await request(baseURL).put("/update"+post._id).send({
        posterId: user._id,
        message : "Hello, doctor !"
      });
      expect(response.status).toBe(200);
    });

    it("should return all posts", async () => {
      const response = await request(baseURL).get("");
      expect(response.status).toBe(200);
    });

    it("should return all given user's posts", async () => {
      const user = new UserModel({
        first_name: "faty",
        last_name: "ly",
        address: "Parcelles Assainies",
        email: "lyfaty@gmail.com",
        user_name: "@fatyly",
        password: "lyfaty123"
      });
      await user.save();

      const response = await  request(baseURL).get("/historique-posts/"+user._id);
      expect(response.status).toBe(200);
    });

    it("should like a given post", async () => {
      
      const response = await request(baseURL).patch("like-post/"+post._id).send({
        id: user2._id,
      });
      expect(response.status).toBe(200);
    });


    it("should unlike a given post", async () => {
      const response = await request(baseURL).patch("unlike-post/"+post._id).send({
        id: user2._id,
      });
      expect(response.status).tobBe(200);
    });


    it("should report a given post", async () => {
      const response = await request(baseURL).patch("report-post/"+post._id).send({
        id: user2._id,
      });
      expect(response.status).toBe(200);
    });


    it("should unreport a given post", async () => {
      const response = await request(baseURL).patch("unreport-post/"+post._id).send({
        id: user2._id,
      });
      expect(response.status).toBe(200);
    });

    it("should delete a specific  given post", async () => {
      response = await request(baseURL).delete("/"+post._id);
      expect(response.status).toEqual(200);
     });
  });