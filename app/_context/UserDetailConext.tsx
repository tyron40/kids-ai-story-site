import { createContext, Dispatch, SetStateAction } from "react"
import { UserInsertProps } from "../_utils/db"

interface UserDetailContextProps {
  userDetail: UserInsertProps | null
  setUserDetail: Dispatch<SetStateAction<UserInsertProps | null>>
}

export const UserDetailContext = createContext<UserDetailContextProps>(
  {} as UserDetailContextProps
)
