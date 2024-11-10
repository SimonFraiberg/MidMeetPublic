import React from "react";

const NotFound: React.FC = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center josefin-sans"
      style={{ height: "10vh", textAlign: "center" }}
    >
      <div>
        You haven't created meetings yet <br />
        Try it out
      </div>
    </div>
  );
};

export default NotFound;
