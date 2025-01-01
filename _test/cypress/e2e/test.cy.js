describe("Express Server Tests", () => {
  const baseUrl = "http://localhost:8090"; // Replace with your server's URL

  it("Should return a welcome message on GET /", () => {
    // Send a GET request to the root endpoint
    cy.request("GET", `${baseUrl}/`).then((response) => {
      // Assert the response status
      expect(response.status).to.eq(200);

      // Assert the response body
      expect(response.body).to.eq("Welcome to the world!");
    });
  });
});
