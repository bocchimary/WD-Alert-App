import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  
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
            // Set the user data
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Clear token and redirect to the login page
        localStorage.removeItem("token");
        router.push("/landing");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark d-fixed">
        <div className="container">
          <Link href="/dashboard">
            <div className="navbar-brand"> <img
              src="https://upload.wikimedia.org/wikipedia/en/c/c8/Technological_University_of_the_Philippines_Seal.svg"
              alt="logo"
              style={{ width: "70px", height: "auto" }}
              className="img-fluid"
            />
           
            </div>
          </Link>
          <span className="ml-3 ml-lg-3 h5 d-none d-sm-block h3">Technological University of The Philippines</span>
          
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNavDropdown"
          >
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="profileDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    className="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="profileDropdown"
                >
                  <li>
              
                    <a
                      className="dropdown-item btn" //logout
                      href="/personnel"
                    
                    >
                      Personnel
                    </a>
                    <a
                      className="dropdown-item btn" //logout
                      href="#"
                      onClick={handleLogout}
                    >
                      Logout
                    </a>

                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}
