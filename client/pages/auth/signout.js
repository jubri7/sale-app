import { useEffect } from "react";
import useRequest from "../hooks/useRequest";
import Router from "next/router";

const SignOut = ({currentUser}) => {
  const { request } = useRequest({});
  useEffect(async () => {
    await request({
      url: "/api/users/signout",
      method: "post",
      body: {},
    });
    Router.push("/");
  }, []);
  return <div></div>;
};

export default SignOut;
