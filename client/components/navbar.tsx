"use client";
import { Link } from "@nextui-org/link";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import clsx from "clsx";
import NextLink from "next/link";

import { GithubIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";

import { logout } from "@/redux/slice/authSlice";
import { Button } from "@nextui-org/button";
import { IconLogin2, IconLogout2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface NavItem {
  href: string;
  label: string;
  requiresLogin?: boolean;
}

interface SiteConfig {
  navItems: NavItem[];
  navMenuItems: NavItem[];
  links: {
    github: string;
  };
}

export const Navbar = () => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    dispatch(logout());

    router.push("/");
  };

  const renderMenuItems = (items: NavItem[]): JSX.Element[] => {
    return items
      .filter((item) => !item.requiresLogin || isAuthenticated)
      .map((item) => (
        <NavbarItem key={item.href}>
          <NextLink
            className={clsx(
              linkStyles({ color: "foreground" }),
              "data-[active=true]:text-primary data-[active=true]:font-medium"
            )}
            color="foreground"
            href={item.href}
          >
            {item.label}
          </NextLink>
        </NavbarItem>
      ));
  };
  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarBrand as="li" className="gap-3 max-w-fit">
        <NextLink className="flex justify-start items-center gap-1" href="/">
          <p className="font-bold text-inherit">BlockCharge</p>
        </NextLink>
      </NavbarBrand>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {renderMenuItems(siteConfig.navItems)}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden md:flex">
          {isAuthenticated ? (
            <Button
              color="primary"
              variant="shadow"
              startContent={<IconLogout2 />}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          ) : (
            <Button
              color="primary"
              variant="shadow"
              startContent={<IconLogin2 />}
              href="/login"
              as={Link}
            >
              Log In
            </Button>
          )}
        </NavbarItem>
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github} aria-label="Github">
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
