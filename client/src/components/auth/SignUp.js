import React, { useState } from "react";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import { ArrowRightAlt } from '@mui/icons-material'
import Link from "next/link";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/router";

import classes from "./auth.module.css";

const EMAIL_REGEX =
/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const SignUp = () => {

  const router = useRouter();

  const [email, setEmail] = useState({value: "test@test.com", touched: false});
  const [password, setPassword] = useState({value: "1234", touched: false});
  const [confirmPassword, setConfirmPassword] = useState({value: "1234", touched: false});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const emailNotValid = email.touched && !EMAIL_REGEX.test(email.value);
  const passwordsDoNotMatch = confirmPassword.touched && password.value !== confirmPassword.value;


  const signUpHandler = async (event) => {
    event.preventDefault();

    setError(null);

    if (emailNotValid || passwordsDoNotMatch) {
      return;
    }

    const payload = {
      email: email.value,
      password: password.value,
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
      setError(error.message || "Something went wrong!!");
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

  const setConfirmPasswordHandler = (event) => {
    const {value} = event.target;
    setConfirmPassword({value, touched: true});
  }

  return (
    <form className={classes.form} onSubmit={signUpHandler}>
      {
        error &&
        <Alert className='alert'  severity="error">{error}</Alert>
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
        error={passwordsDoNotMatch}
        onChange={setPasswordHandler}
      />
      <br />
      <TextField
        type="password"
        label="Confirm Password"
        placeholder="Confirm Password"
        variant="outlined"
        disabled={loading}
        value={confirmPassword.value}
        onChange={setConfirmPasswordHandler}
        error={!!passwordsDoNotMatch}
        helperText={passwordsDoNotMatch && "Passwords do not match"}
      />
      <br />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        className={classes.btn}
      >
        {loading ? <CircularProgress size={23} /> : "SignUp"}
      </Button>
      <div className={classes.link}>
        <Link href="/auth/login">
          Already have an account? Login <ArrowRightAlt />{" "}
        </Link>
      </div>
    </form>
  );
};

export default SignUp;
