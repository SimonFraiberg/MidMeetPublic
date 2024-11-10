function Error({ message }: { message: string }) {
  return (
    <div className="error alert-danger d-flex align-items-center text-center">
      {message}
    </div>
  );
}

export default Error;
