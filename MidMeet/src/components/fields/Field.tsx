import { useState } from "react";
import Form from "react-bootstrap/Form";
import "./field.css";

interface FieldProps {
  id: string;
  name: string;
  text: string;
  type: string;
  className?: string;
  placeholder: string;
  errorMessage: string;
  pattern: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Field({
  id,
  name,
  text,
  type,
  placeholder,
  errorMessage,
  pattern,
  required,
  className = "",
  onChange,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = new RegExp(pattern);
    // Validate based on pattern and required status
    if (required && value === "") {
      setIsInputValid(false);
    } else {
      setIsInputValid(regex.test(value));
    }
    onChange(e);
  };

  return (
    <Form.Group className={className}>
      <Form.Label htmlFor={id}>{text}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        required={required}
        onChange={handleChange}
        onBlur={handleFocus}
        isInvalid={focused && !isInputValid}
        isValid={focused && isInputValid}
      />
      {!isInputValid && focused && (
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

export default Field;
