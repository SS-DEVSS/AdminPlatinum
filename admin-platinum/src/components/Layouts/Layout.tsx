import { useState } from "react";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  LayoutGrid,
  Menu,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  LogOut,
  Boxes,
  Newspaper,
  Megaphone,
  Dock,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";

const menuItems = [
  { href: "/productos", icon: Package, text: "Productos" },
  { href: "/marcas", icon: ShoppingCart, text: "Marcas" },
  { href: "/categorias", icon: LayoutGrid, text: "Categorías" },
  { href: "/kits", icon: Boxes, text: "kits" },
  { href: "/boletines", icon: Newspaper, text: "Boletínes" },
  { href: "/noticias", icon: Megaphone, text: "Noticias" },
  { href: "/banners", icon: Dock, text: "Banners" },
  { href: "/ajustes", icon: Settings, text: "Ajustes" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuLarge, setMenuLarge] = useState<boolean>(false);

  const LinkComponent = ({
    href,
    icon: Icon,
    text,
  }: {
    href: string;
    icon: any;
    text: string;
  }) => (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-4 text-muted-foreground transition-all hover:text-primary ${
          isActive ? "bg-black text-white" : ""
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {menuLarge && <p>{text}</p>}
    </NavLink>
  );

  const LinkComponentMobile = ({
    href,
    icon: Icon,
    text,
  }: {
    href: string;
    icon: any;
    text: string;
  }) => (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-4 text-muted-foreground transition-all hover:text-primary ${
          isActive ? "bg-black text-white mr-6" : ""
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {text}
    </NavLink>
  );

  return (
    <div className="flex-col md:flex md:flex-row h-screen w-full">
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
              {menuLarge && <span>Platinum Driveline</span>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav
              className={`${
                !menuLarge ? "items-center flex flex-col" : "px-2 lg:px-4"
              } text-sm font-medium flex flex-col gap-5 h-full`}
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
                {menuLarge && <p>Cerrar Menu</p>}
              </div>
              <section className="h-full">
                {menuItems.map((item) => (
                  <LinkComponent
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    text={item.text}
                  />
                ))}
              </section>
              <div className="my-auto py-4">
                {!menuLarge && (
                  <LinkComponent
                    href={"/login"}
                    icon={LogOut}
                    text={"Cerrar Sesión"}
                  />
                )}
              </div>
            </nav>
          </div>
          {!menuLarge ? (
            <></>
          ) : (
            <div className="mt-auto p-4">
              <LinkComponent
                href={"/login"}
                icon={LogOut}
                text={"Cerrar Sesión"}
              />
            </div>
          )}
        </div>
      </div>
      <header className="p-3 md:p-0">
        <Sheet>
          <div className="flex justify-between">
            <div className="flex items-center md:hidden gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>Platinum Driveline</span>
            </div>
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
          </div>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              {menuItems.map((item) => (
                <LinkComponentMobile
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </nav>
            <div className="mt-auto">
              <LinkComponentMobile
                href={"/login"}
                icon={LogOut}
                text={"Cerrar Sesión"}
              />
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <div className="flex-1 overflow-y-auto mx-4 md:px-0 py-0 md:my-5">
        {children}
      </div>
    </div>
  );
};

export default Layout;
