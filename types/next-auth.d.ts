import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      cashTapUser: string
      role: string
    }
  }

  interface User {
    id: string
    email: string
    username: string
    cashTapUser: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    username: string
    cashTapUser: string
  }
}

