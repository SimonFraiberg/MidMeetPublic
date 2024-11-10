import "./login.css";
import Card from "../../card/Card";
import Background from "../../background/Background";
import React, { useContext, useState } from "react";
import { TokenContext } from "../../../App";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../apiOperations/userApi";
import { Form, Button, InputGroup } from "react-bootstrap";
import TwoFactorLogin from "./TwoFactorLogin";
import { toast, ToastContainer } from "react-toastify";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

export default function Login() {
  // Get the query parameters from the current URL
  const queryParams = new URLSearchParams(window.location.search);

  const [open2FA, setOpen2FA] = useState(false);
  const { setToken } = useContext(TokenContext);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  // State to handle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const inputs = [
    {
      id: 1,
      name: "email",
      text: "Email",
      type: "text",
      required: true,
    },
    {
      id: 2,
      name: "password",
      text: "Password",
      type: "password",
      required: true,
    },
  ];

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = await login(values.email, values.password);

    if (token === "wrong email or password") {
      setToken("failed");
      toast.error("Invalid email or password");
    } else {
      if (token === "Wrong Google Token") {
        setToken("failed");
      } else {
        if (token === "2fa") {
          setOpen2FA(true);
        } else {
          setToken(token);
          // Check if the 'returnUrl' parameter exists
          if (queryParams.has("returnUrl")) {
            // 'returnUrl' parameter exists
            const returnUrl = queryParams.get("returnUrl");

            navigate(`/HomePage?returnUrl=${returnUrl}`);
          } else {
            navigate("/HomePage");
          }
        }
      }
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  /*
      <Card>
        <form className="formContainer">
          <Field text="username" type="text" />
          <Field text="password" type="password" />
          <Button name="Login" className="buttonPostion" />
          <div id="toRegister">New? Register here</div>
*/

  return (
    <Background>
      <TwoFactorLogin
        email={values.email}
        password={values.password}
        open2FA={open2FA}
        setOpen2FA={setOpen2FA}
      />
      <Card className="loginCard" logo={true}>
        <Form className="loginForm" onSubmit={handleSubmit}>
          <Form.Group>
            {inputs.map((input) => (
              <>
                <Form.Label className="anek-devanagari">
                  {input.text}
                </Form.Label>
                {input.name === "password" ? (
                  <InputGroup>
                    <Form.Control
                      name={input.name}
                      className="loginField"
                      type={showPassword ? "text" : "password"}
                      onChange={onChange}
                    />
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                      className="loginField password-toggle-icon "
                    >
                      {showPassword ? (
                        <VisibilityRoundedIcon />
                      ) : (
                        <VisibilityOffRoundedIcon />
                      )}
                    </InputGroup.Text>
                  </InputGroup>
                ) : (
                  <Form.Control
                    name={input.name}
                    className="loginField"
                    type={input.type}
                    onChange={onChange}
                  />
                )}
              </>
            ))}
            <div id="toRegister">
              <Link to="/Register"> New? Register here </Link>
            </div>
            <Button type="submit" className="loginButton">
              LOGIN
            </Button>
          </Form.Group>
        </Form>
      </Card>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Background>
  );
}
