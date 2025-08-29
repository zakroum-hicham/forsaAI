import { Plus, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "../Logo"
import Link from "next/link"
import SignOutButton from "../SignOutButton"

const DashboardHeader = ({ session }: { session: SessionType }) => {

  const name = session?.user?.name || "";
  const nameParts = name.split(" ");
  const firstNameInitial = name.charAt(0).toUpperCase() || "?";
  const lastNameInitial = nameParts.length > 1 ? nameParts.pop()?.charAt(0).toUpperCase() : "";
  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />

          {/* <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search jobs, candidates, or activities..." className="pl-10 bg-muted/50" />
          </div> */}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/jobs/create">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Job
            </Button>
          </Link>

          {/* <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
          </Button> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image} alt="User" />
                  <AvatarFallback>{firstNameInitial + lastNameInitial || "?"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
                <Link href="/profile">
              <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
              </DropdownMenuItem>
                </Link>
                
                <Link href="/settings">
              <DropdownMenuItem>
                 <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
              </DropdownMenuItem>
                </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem><SignOutButton /></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
export default DashboardHeader;