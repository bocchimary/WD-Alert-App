import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav } from "react-bootstrap";

export default function Sidebar() {
  return (
    <div className="d-flex" id="wrapper">
      <Navbar expand="lg" id="sidebar" className="flex-column" style={{height:'74vh', backgroundColor: 'brown'}}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="flex-column">
            <div>
            <Nav.Link href="/dashboard" className="cursor-pointer text-white">Dashboard</Nav.Link>
            <Nav.Link href="/wdras-main" className="cursor-pointer text-white">Refill Logs</Nav.Link>
            <Nav.Link href="#" className="cursor-pointer text-white">Change Refill Number</Nav.Link>
            <Nav.Link href="#" className="cursor-pointer text-white">Dispenser Switch</Nav.Link>
            <Nav.Link href="#" className="cursor-pointer text-white">Navigation 5</Nav.Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
