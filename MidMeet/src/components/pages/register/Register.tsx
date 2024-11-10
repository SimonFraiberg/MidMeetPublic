import "./register.css";
import Background from "../../background/Background";
import Card from "../../card/Card";
import { useNavigate, Link } from "react-router-dom";
import { addUser } from "../../../apiOperations/userApi";
import LocationInputField from "../../fields/LocationInputField";

import { Form, Button, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import PictureUpload from "../../fields/PictureUpload";
import { Formik } from "formik";
import * as Yup from "yup";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  // State to handle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Define the validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, "First Name must be at least 2 characters")
      .max(50, "First Name cannot be more than 50 characters")
      .required("First Name is required"),

    lastName: Yup.string()
      .min(2, "Last Name must be at least 2 characters")
      .max(50, "Last Name cannot be more than 50 characters")
      .required("Last Name is required"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one digit")
      .matches(
        /[!@#$%^&*]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),

    confirm: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),

    profilePic: Yup.string().required("Profile picture is required"),
  });

  return (
    <Background>
      <Card logo={true}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirm: "",
            firstName: "",
            lastName: "",
            profilePic: "",
            location: { address: "", lng: 0, lat: 0 },
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            console.log("Submitted values:", values); // Debugging line
            try {
              const success = await addUser(values);
              if (!success) {
                toast.error("Error creating account");
              } else {
                toast.success("Account created successfully");
                navigate("/Login");
              }
            } catch (error) {
              toast.error("Unexpected error occurred");
            }
          }}
        >
          {({
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
            setFieldValue,
            isValid,
            handleSubmit,
          }) => {
            // Debugging lines
            console.log("Errors:", errors);
            console.log("Touched:", touched);
            console.log("Is Valid:", isValid);

            return (
              <Form noValidate onSubmit={handleSubmit}>
                <PictureUpload
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  error={errors.profilePic}
                  touched={touched.profilePic}
                />
                <div className="nameFields">
                  <Form.Group className="name">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.firstName && !errors.firstName}
                      isInvalid={touched.firstName && !!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="name">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.lastName && !errors.lastName}
                      isInvalid={touched.lastName && !!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <Form.Group className="field">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.email && !errors.email}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="field">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.password && !errors.password}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                      className="password-toggle-icon"
                    >
                      {showPassword ? (
                        <VisibilityRoundedIcon />
                      ) : (
                        <VisibilityOffRoundedIcon />
                      )}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="field">
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.confirm && !errors.confirm}
                    isInvalid={touched.confirm && !!errors.confirm}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirm}
                  </Form.Control.Feedback>
                </Form.Group>
                <LocationInputField setLocation={setFieldValue} />
                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="registerButton"
                    size="lg"
                    disabled={isSubmitting || !isValid}
                  >
                    CREATE ACCOUNT
                  </Button>
                </div>
                <div id="toLogin">
                  <Link to="/Login"> Already Registered? Login Here</Link>
                </div>
              </Form>
            );
          }}
        </Formik>
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
