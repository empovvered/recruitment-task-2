import { screen, setup } from "tests"

describe("test harness", () => {
  it("renders into jsdom through the app wrapper, drives it with user-event and applies jest-dom matchers", async () => {
    const { user } = setup(
      <button type="button" onClick={(event) => (event.currentTarget.textContent = "clicked")}>
        ready
      </button>,
    )

    await user.click(screen.getByRole("button", { name: "ready" }))

    expect(screen.getByRole("button", { name: "clicked" })).toBeInTheDocument()
  })
})
