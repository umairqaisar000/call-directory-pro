import { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { login } from "../../api/Auth";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Login = () => {
  const navigate = useNavigate();
  const username = useRef();
  const password = useRef();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username.current.value, password.current.value);
      if (!res) {
        setErrorMessage("Invalid Email or Password");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setErrorMessage("Invalid Email or Password");
    }
  };

  return (
    <div className="container" style={{ marginTop: "10vw" }}>
      <div className="card p-4 mx-auto w-50">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" ref={username} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={password}
            />
          </Form.Group>
          {errorMessage && (
            <div className="alert alert-danger mt-2">{errorMessage}</div>
          )}

          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
