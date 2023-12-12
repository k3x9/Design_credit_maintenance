import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Snackbar from "../snack_bar/toast";

const csrftoken = Cookies.get("csrfToken");
function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    user_type: "",
    department: "",
    roll_number: ""
  });
  const [notify, setNotify] = React.useState({
    open: false,
    message: "",
    severity: "success",
    handleClose: () => {
      setNotify((prev) => ({ ...prev, open: false }));
    },
  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { name, email, password,confirm_password, user_type, department, roll_number} = state;
    axios.post("http://localhost:8000/signup/",
        {
            name: name,
            email: email,
            password: password,
            confirm_password: confirm_password,
            user_type: user_type,
            department: department,
            roll_number: roll_number
        },
        {
            headers: {
            "X-CSRFToken": csrftoken,
            }
        }
        )
        .then((res) => {
            console.log(res);
            console.log(res.data);
            const message = res.data.message;
            if (res.data.status===200 || res.data.status===201)
            {
            setState({
                name: "",
                email: "",
                password: "",
                confirm_password: "",
                user_type: "",
                department: "",
                roll_number: ""
            });
            setNotify({
                open: true,
                message: message,
                severity: "success",
                handleClose: () => {
                setNotify((prev) => ({ ...prev, open: false }));
                },
            });
          }
            else{
                setNotify({
                    open: true,
                    message: message,
                    severity: "error",
                    handleClose: () => {
                    setNotify((prev) => ({ ...prev, open: false }));
                    },
                });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            setNotify({
                open: true,
                message: "Server is probably down",
                severity: "error",
                handleClose: () => {
                setNotify((prev) => ({ ...prev, open: false }));
                },
            });
        });
  };

  return (
    <div>
      <div className="Signinoncss">
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="password"
          name="confirm_password"
          value={state.confirm_password}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <select
          name="user_type"
          value={state.user_type}
          onChange={handleChange}
        >
          <option value="">None</option>
          <option value="student">Student</option>
          <option value="supervisor">Supervisor</option>
          <option value="faculty_advisor">Faculty Advisor</option>
        </select>
        <select
          name="department"
          value={state.department}
          onChange={handleChange}
        >
          <option value="">None</option>
          <option value="CSE">CSE</option>
          <option value="ME">ME</option>
          <option value="CH">CH</option>
          <option value="BB">BB</option>
          <option value="EE">EE</option>
          <option value="CI">CI</option>
        </select>
        <input
          type="text"
          name="roll_number"
          value={state.roll_number}
          onChange={handleChange}
          placeholder="Roll Number"
          style = {{display: state.user_type === "student" ? "block" : "none"}}
          required={state.user_type === "student" ? true : false}
        />
        <button>Sign Up</button>
      </form>
    </div>
    </div>
    <Snackbar prop={notify} />
    </div>
  );
}

export default SignUpForm;
