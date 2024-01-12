import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Redirect to the login page if token is not found
          router.push("/login");
        } else {
          const response = await fetch("/api/auth/check-auth", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (!response.ok) {
            // Redirect to the login page if the token is invalid
            router.push("/login");
          } else {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    checkAuthentication();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "----- From Submitted------\n",
      "\nEmail : ",
      email,
      "\nPassword : ",
      password
    );
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      const { token } = data;
      // Save the token to localStorage or a cookie
      localStorage.setItem("token", token);
      console.log("----Login API Response---\n", data);
      if (res.ok) {
        setApiResponse("Redirecting . . . .");
        console.log("Login Successful...");
        router.push("/dashboard");
      } else {
        setApiResponse(data.message);
      }
    } catch (error) {
      setApiResponse("Server error");
    }
  };

  return (
    <div className={styles.container}>
      <div className="row justify-content-center">
        <div className="col-md-4 mt-5">
          <div className="card">
            <div className="card-header">Admin Login</div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="was-validated">
                {apiResponse && (
                  <div className="alert alert-danger" role="alert">
                    {apiResponse}
                  </div>
                )}
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control p-3 fs-5 bg-transparent text-black"
                    id="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control p-3 fs-5 bg-transparent text-black mt-3"
                    id="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">{}</div>
                </div>
                <input
                  type="submit"
                  className="btn btn-primary mt-5"
                  values="Login"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
