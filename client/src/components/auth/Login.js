import React, { useState } from "react";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import { ArrowRightAlt } from '@mui/icons-material'
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import classes from "./auth.module.css";

const EMAIL_REGEX =
/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState({value: "test@test.com", touched: false});
  const [password, setPassword] = useState({value: "1234", touched: false});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const emailNotValid = email.touched && !EMAIL_REGEX.test(email.value);

  const signInHandler = async (event) => {
    event.preventDefault();

    setError(null);

    if (emailNotValid) {
      return;
    }

    const payload = {
      email: email.value,
      password: password.value,
      method: 'login',
    }

    try {
      setLoading(true);
      const response = await signIn("credentials", {
        ...payload,
        callbackUrl: "/tickets/all",
        redirect: false,
      });
      console.log(response);
      if (response.ok) {
        router.replace(response.url);
      } else {
        let errorMessage = "Something went wrong";
        if (typeof response.error === 'string' && response.error)
          errorMessage = response.error;
        setError(errorMessage);
      }
      
    } catch (error) {
      console.dir(error);
      setError(error);
    } finally {
      setLoading(false);
    }

  }

  const setEmailHandler = (event) => {
    const {value} = event.target;
    setEmail({value, touched: true});
  }

  const setPasswordHandler = (event) => {
    const {value} = event.target;
    setPassword({value, touched: true});
  }

  return (
    <form className={classes.form} onSubmit={signInHandler} >
      {
        error &&
        <Alert className='alert' severity="error">{error}</Alert>
      }
      <TextField
        type="email"
        label="Email Address"
        placeholder="Email Address"
        variant="outlined"
        color="primary"
        disabled={loading}
        value={email.value}
        onChange={setEmailHandler}
        error={!!emailNotValid}
        helperText={emailNotValid && "Please enter a valid email address"}
      />
      <br />
      <TextField
        type="password"
        label="Password"
        placeholder="Password"
        variant="outlined"
        disabled={loading}
        value={password.value}
        onChange={setPasswordHandler}
      />
      <br />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        className={classes.btn}
      >
        {loading ? <CircularProgress size={23} /> : "Login"}
      </Button>
      <div className={classes.link} >
        <Link href="/auth/signup" >Create new Account? Sign Up <ArrowRightAlt /> </Link>
      </div>
    </form>
  );
};

export default Login;
