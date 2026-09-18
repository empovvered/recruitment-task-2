import { screen, setup } from "tests"

import { Button } from "./button"

describe("Button", () => {
  it("defaults to type button, so it never submits a form by accident", () => {
    setup(<Button testId="save">Zapisz</Button>)

    expect(screen.getByRole("button", { name: "Zapisz" })).toHaveAttribute("type", "button")
  })

  it("does not fire while disabled", async () => {
    const onClick = vi.fn()
    const { user } = setup(
      <Button testId="save" isDisabled onClick={onClick}>
        Zapisz
      </Button>,
    )

    await user.click(screen.getByRole("button", { name: "Zapisz" }))

    expect(screen.getByRole("button", { name: "Zapisz" })).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it("announces work in progress, ignores presses and keeps the focus it has", async () => {
    const onClick = vi.fn()
    const { user } = setup(
      <Button testId="save" isLoading onClick={onClick}>
        Zapisz
      </Button>,
    )
    const button = screen.getByRole("button", { name: "Zapisz" })

    button.focus()
    await user.click(button)

    expect(button).toHaveAttribute("aria-busy", "true")
    expect(button).toHaveAttribute("aria-disabled", "true")
    expect(button).not.toBeDisabled()
    expect(button).toHaveFocus()
    expect(onClick).not.toHaveBeenCalled()
  })
})
