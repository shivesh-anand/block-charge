"use client";
import { StationIcon, UserIcon } from "@/components/icons";
import StationSignUpForm from "@/components/StationSignUp";
import UserSignUpForm from "@/components/UserSignUp";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { Tab, Tabs } from "@nextui-org/tabs";
const LoginPage = () => {
  return (
    <Card className="justify-center items-center px-4" fullWidth={true}>
      <CardHeader className="flex flex-col gap-3 text-center">
        <h1 className="font-black text-xl ">Sign Up to BlockCharge</h1>
      </CardHeader>

      <CardBody>
        <Tabs aria-label="Options" fullWidth={true}>
          <Tab
            key="user"
            title={
              <div className="flex items-center space-x-2">
                <UserIcon />
                <span>Sign Up as User</span>
              </div>
            }
          >
            <UserSignUpForm />
          </Tab>
          <Tab
            key="station"
            title={
              <div className="flex items-center space-x-2">
                <StationIcon />
                <span>Sign Up as Station</span>
              </div>
            }
          >
            <StationSignUpForm />
          </Tab>
        </Tabs>
      </CardBody>

      <CardFooter className="justify-center">
        Already have an account?
        <Link
          showAnchorIcon
          className="px-4 font-bold text-lg"
          color="foreground"
          href="/login"
        >
          Log In
        </Link>
      </CardFooter>
    </Card>
  );
};
export default LoginPage;
