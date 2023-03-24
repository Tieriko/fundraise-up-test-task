import request from "supertest"
import htmlServer, {HTML_PATHS} from "./html"

describe("htmlServer", () => {
  it(`should serve index.html for ${HTML_PATHS.join(", ")}`, async () => {
    const responses = await Promise.all(
      HTML_PATHS.map(path => request(htmlServer.callback()).get(path))
    )

    responses.forEach(response => {
      expect(response.status).toBe(200)
      expect(response.type).toBe("text/html")
      expect(response.text).toContain("<html>")
    })
  })

  it("should return a 404 status for non-existing paths", async () => {
    const response = await request(htmlServer.callback()).get("/non-existing")

    expect(response.status).toBe(404)
  })
})
