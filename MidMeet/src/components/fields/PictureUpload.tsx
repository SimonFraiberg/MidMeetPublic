import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import "./pictureUpload.css";

interface PictureUploadProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  error: string | undefined;
  touched: boolean | undefined;
}

function PictureUpload({
  setFieldValue,
  handleBlur,
  error,
  touched,
}: PictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isInputValid, setIsInputValid] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreview(reader.result as string);
        // Use Formik's setFieldValue to set the file in Formik state
        setFieldValue("profilePic", reader.result as string);
      };
    }
  };

  const onCLick = () => {
    if (touched && !error) {
      setIsInputValid(true);
    } else setIsInputValid(false);
    console.log("picture" + isInputValid);
  };

  return (
    <Form.Group className="mb-3 text-center">
      <Form.Label htmlFor="picture">
        <Image
          src={preview || "user-default-image.png"}
          roundedCircle
          className={`upload-preview`}
          alt="Upload"
          onBlur={handleBlur}
          onClick={onCLick}
        />
      </Form.Label>
      <Form.Control
        name="profilePic"
        type="file"
        id="picture"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the file input
        isValid={isInputValid}
        isInvalid={!isInputValid}
      />
      {!isInputValid && (
        <div className="invalid-feedback" style={{ display: "block" }}>
          {error}
        </div>
      )}
    </Form.Group>
  );
}

export default PictureUpload;
