import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container d-flex">
          <Link href="/dashboard">
            <div className="navbar-brand"> <img
              src="https://upload.wikimedia.org/wikipedia/en/c/c8/Technological_University_of_the_Philippines_Seal.svg"
              alt="logo"
              style={{ width: "70px", height: "auto" }}
              className="img-fluid"
            />
           
            </div>
          </Link>
          <span className="ml-1 ml-lg-3 h5 d-flex d-sm-block h3">Technological University of The Philippines</span>
        </div>
      </nav>
  );
}
