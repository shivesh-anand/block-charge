"use client";

import { StationIcon, UserIcon } from "@/components/icons";
import StationLoginForm from "@/components/StationLogin";
import UserLoginForm from "@/components/UserLogin";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  Tab,
  Tabs,
} from "@nextui-org/react";

const LoginPage = () => {
  return (
    <Card className="flex flex-col justify-center items-center px-4" fullWidth>
      <CardHeader className="flex flex-col gap-3 text-center">
        <h1 className="font-black text-xl">Login to BlockCharge</h1>
      </CardHeader>

      <CardBody>
        <Tabs aria-label="Options" fullWidth>
          <Tab
            key="user"
            title={
              <div className="flex items-center space-x-2">
                <UserIcon />
                <span>Login As User</span>
              </div>
            }
          >
            <UserLoginForm />
          </Tab>
          <Tab
            key="station"
            title={
              <div className="flex items-center space-x-2">
                <StationIcon />
                <span>Login As Station</span>
              </div>
            }
          >
            <StationLoginForm />
          </Tab>
        </Tabs>
      </CardBody>

      <CardFooter className="justify-center">
        Don&apos;t have an account yet?
        <Link
          showAnchorIcon
          className="px-4 font-bold text-lg"
          color="foreground"
          href="/signup"
        >
          Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
