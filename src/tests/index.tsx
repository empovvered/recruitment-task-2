import { render as baseRender, RenderOptions } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ReactElement } from "react"

import { Wrapper } from "./wrapper"

type CustomRenderOptions = Omit<RenderOptions, "wrapper">

const render = (ui: ReactElement, options: CustomRenderOptions = {}) => baseRender(ui, { wrapper: Wrapper, ...options })

//INFO: Pairs a render with a user-event session, so a spec drives the component the way a person would
const setup = (ui: ReactElement, options: CustomRenderOptions = {}) => ({
  user: userEvent.setup(),
  ...render(ui, options),
})

export * from "@testing-library/react"
export { render, setup }
