import useCustomeMutation from "@/hooks/useCustomeMutation";
import { useState } from "react";

function Index() {
  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
    phone: "",
    otp: "",
  });
  const { mutate } = useCustomeMutation(
    "login",
    null,
    "/auth/login",
    null,
    "post"
  );

  const { mutate: getOtpMutate } = useCustomeMutation(
    "getOtp",
    null,
    "/auth/getOtp",
    null,
    "post"
  );

  const { mutate: sendOtpMutate } = useCustomeMutation(
    "sendOtp",
    null,
    "/auth/checkOtp",
    null,
    "post"
  );

  const loginHandler = (event, data) => {
    event.preventDefault();
    mutate(data, {
      onSuccess: (response) => {
        console.log(response.message);
      },
      onError: (err) => {
        const errorMessage = err.response.data;
        console.log(errorMessage);
      },
    });
  };

  const getOtpHandler = (event, phoneNumber) => {
    event.preventDefault();
    getOtpMutate(
      { phone: phoneNumber },
      {
        onSuccess: (response) => {
          console.log(response.message);
        },
        onError: (err) => {
          const errorMessage = err.response.data;
          console.log(errorMessage);
        },
      }
    );
  };

  const sendOtpHandler = (event, otp) => {
    event.preventDefault();
    sendOtpMutate(
      { code: otp },
      {
        onSuccess: (response) => {
          console.log(response);
        },
        onError: (err) => {
          const errorMessage = err.response.data;
          console.log(errorMessage);
        },
      }
    );
  };
  return (
    <>
      <div className="login-logut">
        <h3>Login & Logut</h3>
        <input
          type="text"
          placeholder="username ..."
          value={inputs.userName}
          onChange={(event) =>
            setInputs((prev) => ({ ...prev, userName: event.target.value }))
          }
        />
        <input
          type="password"
          placeholder="password"
          value={inputs.password}
          onChange={(event) =>
            setInputs((prev) => ({ ...prev, password: event.target.value }))
          }
        />

        <button onClick={(event) => loginHandler(event, inputs)}>Login</button>
        <button
          onClick={async () => {
            const res = await fetch("http://localhost:3000/api/auth/logout");
            const data = await res.json();
            console.log(data);
          }}
        >
          Logout
        </button>
      </div>

      <hr />

      <div className="resetPassword">
        <h3>Reset Password</h3>
        <div className="getOtp">
          <input
            type="number"
            value={inputs.phone}
            onChange={(event) =>
              setInputs((prev) => ({ ...prev, phone: event.target.value }))
            }
          />

          <button onClick={(event) => getOtpHandler(event, inputs.phone)}>
            Send Sms
          </button>
        </div>
        <div className="checkOtp">
          <input
            type="number"
            value={inputs.otp}
            onChange={(event) =>
              setInputs((prev) => ({ ...prev, otp: event.target.value }))
            }
          />

          <button onClick={(event) => sendOtpHandler(event, inputs.otp)}>
            Send Code
          </button>
        </div>
      </div>
    </>
  );
}

export default Index;
