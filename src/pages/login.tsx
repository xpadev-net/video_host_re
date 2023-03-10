import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { request } from "@/libraries/request";
import { authResponse, tryAuthResponse } from "@/@types/api";
import Styles from "@/styles/login.module.scss";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    void (async () => {
      const req = await request(`/tryAuth/`);
      const res = (await req.json()) as tryAuthResponse;
      if (res.status === "success") {
        void router.push(
          router.query.callback ? `${router.query.callback}` : "/"
        );
        return;
      }
      setLoading(false);
    })();
  }, [router]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    void (async () => {
      const data = new FormData(e.target as HTMLFormElement);
      const req = await request(`/auth/`, {
        method: "POST",
        body: data,
      });
      const res = (await req.json()) as authResponse;
      if (res.status === "fail") {
        setMessage("incorrect username or password");
        setLoading(false);
        return;
      }
      void router.push(
        router.query.callback ? `${router.query.callback}` : "/"
      );
    })();
    e.preventDefault();
  };

  return (
    <div className={Styles.wrapper}>
      {loading && <div className={Styles.loading} />}
      {message && <div>{message}</div>}
      <form className={Styles.form} onSubmit={onSubmit}>
        <input
          type={"text"}
          required={true}
          name={"username"}
          className={Styles.input}
          placeholder={"Username"}
        />
        <input
          type={"password"}
          required={true}
          name={"password"}
          className={Styles.input}
          placeholder={"Password"}
        />
        <button type="submit" className={Styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
