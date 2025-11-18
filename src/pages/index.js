import useCustomeMutation from "@/hooks/useCustomeMutation";
import useCustomeQuery from "@/hooks/useCustomeQuery";
import { useState } from "react";

function Index() {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    personnelCode: "",
    phone: "",
    plan: "",
  });
  const { mutate } = useCustomeMutation(
    "login",
    null,
    "/auth/login",
    null,
    "post"
  );

  const { mutate: createManagerMutate } = useCustomeMutation(
    "managers",
    null,
    "/managers",
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

  const createManagerHandler = (event, data) => {
    event.preventDefault();
    createManagerMutate(data, {
      onSuccess: (response) => {
        console.log(response.message);
      },
      onError: (err) => {
        const errorMessage = err.response.data;
        console.log(errorMessage);
      },
    });
  };

  // const { data } = useCustomeQuery("me", null, "/auth/me", null);
  // console.log(data);
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
      <div className="create-manager">
        <input
          type="text"
          placeholder="firstName ..."
          value={inputs.firstName}
          onChange={(event) =>
            setInputs((prev) => ({ ...prev, firstName: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="lastName ..."
          value={inputs.lastName}
          onChange={(event) =>
            setInputs((prev) => ({ ...prev, lastName: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="nationalCode ..."
          value={inputs.nationalCode}
          onChange={(event) =>
            setInputs((prev) => ({ ...prev, nationalCode: event.target.value }))
          }
        />
        <input
          type="text"
          placeholder="personnelCode ..."
          value={inputs.personnelCode}
          onChange={(event) =>
            setInputs((prev) => ({
              ...prev,
              personnelCode: event.target.value,
            }))
          }
        />
        <input
          type="text"
          placeholder="phone ..."
          value={inputs.phone}
          onChange={(event) =>
            setInputs((prev) => ({ ...prev, phone: event.target.value }))
          }
        />
        <input
          type="text" 
          placeholder="plan ..."
          value={inputs.plan}
          onChange={(event) =>
            setInputs((prev) => ({ ...prev, plan: event.target.value }))
          }
        />
        <button onClick={(event) => createManagerHandler(event, { ...inputs })}>
          create
        </button>
      </div>
    </>
  );
}

export default Index;
