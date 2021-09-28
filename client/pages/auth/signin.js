import { useEffect, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { request, errors } = useRequest({});
  let response = false;
  useEffect(() => {
    if (response) Router.push("/");
  }, [response]);

  const submitHandler = async (event) => {
    event.preventDefault();
    response = await request({
      url: "/api/users/signin",
      method: "post",
      body: { email, password },
    });
    if (response) Router.push("/");
  };
  return (
    <form onSubmit={submitHandler}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        ></input>
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        ></input>
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};

export default Signin;
