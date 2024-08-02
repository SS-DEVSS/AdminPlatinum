import { useState } from "react";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Home,
  LayoutGrid,
  LineChart,
  Menu,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";

const menuItems = [
  { href: "/admin", icon: Home, text: "Dashboard" },
  { href: "/admin/Orders", icon: ShoppingCart, text: "Orders" },
  { href: "/admin/Categories", icon: LayoutGrid, text: "Categories" },
  { href: "/admin/Products", icon: Package, text: "Products" },
  { href: "/admin/Settings/General", icon: Settings, text: "Settings" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuLarge, setMenuLarge] = useState<boolean>(false);

  const LinkComponent = ({ href, icon: Icon, text }) => (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary`}
    >
      <Icon className="h-4 w-4" />
      {menuLarge && <p>{text}</p>}
    </a>
  );

  return (
    <div className="flex h-screen w-full">
      <div
        className={`${
          !menuLarge ? "w-12" : "w-[280px]"
        } hidden border-r bg-muted/40 md:block`}
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div
            className={`${
              !menuLarge ? "mx-auto px-0" : "px-4 lg:px-6"
            } flex h-14 items-center border-b lg:h-[60px]`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              {menuLarge && <span>Acme Inc</span>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav
              className={`${
                !menuLarge ? "items-center flex flex-col" : "px-2 lg:px-4"
              } text-sm font-medium flex flex-col gap-5`}
            >
              <div
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer"
                onClick={() => setMenuLarge(!menuLarge)}
              >
                {menuLarge ? (
                  <ArrowLeftFromLine className="h-4 w-4" />
                ) : (
                  <ArrowRightFromLine className="h-4 w-4" />
                )}
                {menuLarge && <p>Toggle Sidebar</p>}
              </div>
              {menuItems.map((item) => (
                <LinkComponent
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            {menuLarge && (
              <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Unlock all features and get unlimited access to our support
                    team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </a>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
