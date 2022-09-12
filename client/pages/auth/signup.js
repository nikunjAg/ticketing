import { useState } from "react";
import Router from 'next/router';

import { useRequest } from "../../hooks/use-request";

const signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	
	const [errors, sendRequest] = useRequest({
		url: "/api/users/signup",
		method: "POST",
		body: { email, password },
	});

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  }

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  }

  const submitFormHandler = async (e) => {
		e.preventDefault();
				
		const response = await sendRequest();

		if (response && response.status === 201) {
			Router.push('/');
		}
  }

	return (
		<div className="container">
			<form onSubmit={submitFormHandler}>
				{errors}
				<h1>Signup</h1>
				<div className="form-group mb-3">
					<label>Email</label>
					<input
						type="email"
						placeholder="Enter email address"
						className="form-control"
						value={email}
						onChange={emailChangeHandler}
					/>
				</div>
				<div className="form-group mb-3">
					<label>Password</label>
					<input
						type="password"
						placeholder="Enter password"
						className="form-control"
						value={password}
						onChange={passwordChangeHandler}
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Submit
				</button>
			</form>
		</div>
	);
};

export default signup;
