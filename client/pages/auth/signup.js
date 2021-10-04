import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../hooks/useRequest"

const Signup = () => {
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
      url: "/api/users/signup",
      method: "post",
      body: { email, password },
    });
    if (response) Router.push("/");
  };
  return (
    <form onSubmit={submitHandler}>
      <h1>Sign Up</h1>
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
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default Signup;
