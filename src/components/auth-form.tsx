"use client"
import React from "react"
import { Button, buttonVariants } from "./ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Login from "./auth/login"
import Register from "./auth/register"
import { useAuthStore } from "@/store"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import { ImSpinner8 } from "react-icons/im"

const AuthForm = () => {
  const { data: session, status } = useSession()
  const [isAuthOpen, setIsAuthOpen] = useAuthStore((store) => [
    store.isAuthOpen,
    store.setIsAuthOpen,
  ])

  const [isLogin, setIsLogin] = useAuthStore((store) => [
    store.isLogin,
    store.setIsLogin,
  ])

  if (status === "loading") {
    return (
      <div className={buttonVariants({ size: "sm", variant: "ghost" })}>
        <ImSpinner8 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  console.log(status)

  console.log(isAuthOpen)

  return (
    <>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              aria-label="toggle dropdown"
              className="relative h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.user.image ?? ""}
                  alt={session.user.name ?? ""}
                />
                <AvatarFallback>
                  <div className="h-full w-full animate-pulse"></div>
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mr-4 mt-4 w-64"
            align="start"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link className="w-full" href={`/profile/${session?.user?.id}`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                onClick={() => signOut()}
                // variant="ghost"
                className="relative h-8 w-full justify-start"
              >
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button size="sm" onClick={() => setIsAuthOpen(true)}>
          Sign in
        </Button>
      )}

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="pb-12 md:pb-6">
          <DialogHeader>
            <DialogTitle>
              {!isLogin ? "Login" : "Create an account"}
            </DialogTitle>
            <DialogDescription>
              {isLogin
                ? "Create an account to enjoy more features"
                : "Enjoy your favourite anime in high quality for free!"}
            </DialogDescription>
          </DialogHeader>
          {!isLogin ? <Login /> : <Register />}
          <div className="absolute bottom-4 left-6">
            {!isLogin ? (
              <>
                Don&apos;t have an account
                <button
                  className="ml-2 text-primary"
                  onClick={() => setIsLogin(true)}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button
                  className="ml-2 text-primary"
                  onClick={() => setIsLogin(false)}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AuthForm
