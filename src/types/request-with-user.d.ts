import { UserDoc } from "../models/User"

declare global {
  namespace Express {
    interface User extends UserDoc {}
  }
}