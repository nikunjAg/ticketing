import { useState } from "react";
import axios from "axios";


const signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  }

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  }

  const submitFormHandler = async (e) => {
    e.preventDefault();
    console.log(email, password);

    try {
      const response = await axios.post("http://auth-srv:3000/api/users/signup", {
        email,
        password,
      });
      console.log(response.data);
    } catch(err) {
      console.log(err);
    }
  }

	return (
		<form onSubmit={submitFormHandler} >
			<h1>Signup</h1>
			<div className="form-group">
				<label>Email</label>
				<input
					type="email"
					placeholder="Enter email address"
					className="form-control"
					value={email}
					onChange={emailChangeHandler}
				/>
			</div>
			<div className="form-group">
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
	);
};

export default signup;
