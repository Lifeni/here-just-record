import { createContext } from "react"

export const SiteContext = createContext({
  data: {},
  updatePost: () => {},
  updateTag: () => {},
})
