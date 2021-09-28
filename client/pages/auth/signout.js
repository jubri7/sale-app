import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const SignOut = () => {
  const { request } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
  });
  useEffect(() => {
    request();
    Router.push("/");
  }, []);
  return <div></div>;
};

export default SignOut;
