const request = require("supertest");

it("should return hello world", async () => {
  await request(strapi.server.httpServer)
    .get("/api/hello")
    .expect(200) // Expect response http code 200
    .then((data) => {
      expect(data.text).toBe("Hello World!"); // expect the response text
    });
});
