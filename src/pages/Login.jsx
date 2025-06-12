import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useAuth } from "../Context/FakeAuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  }

  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/app", { replace: true }); //once the navigation happens replace will replace the login page in history stack with "/app"
      }
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login} onSubmit={handleSubmit}>
      <PageNav />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
/*
Using htmlFor improves accessibility by linking labels and form fields, so screen readers and click behaviors work properly.

In React, you use htmlFor (instead of for) in a <label> element to associate it with an <input>.


<label htmlFor="email">Email Address</label>
<input id="email" type="email" />

This associates the label with the input having id="email".
------------------------------------------------------------
In plain HTML, it’s written like:
<label for="email">Email Address</label>


But in React, for is a reserved JavaScript keyword, so React uses htmlFor instead.
*/
