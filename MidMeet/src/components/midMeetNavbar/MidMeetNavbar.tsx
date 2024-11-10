import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { logout } from "../../apiOperations/userApi";
import "./MidMeetNavbar.css";
export default function MidMeetNavbar() {
  return (
    <>
      <Navbar expand={"lg"} className="navbar-dark bg-primary">
        <Container fluid>
          <Navbar.Brand className="josefin-sans-1" href="/HomePage">
            {" MIDMEET"}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                MidMeet
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {location.pathname !== "/" && (
                  <Nav.Link className="josefin-sans" href="/HomePage">
                    Home
                  </Nav.Link>
                )}

                <Nav.Link className="josefin-sans" href="/Settings">
                  Settings
                </Nav.Link>
                <Nav.Link className="josefin-sans" href="/Meetings">
                  My Meettings
                </Nav.Link>
                <Nav.Link
                  onClick={() => logout()}
                  className="josefin-sans"
                  href="/Login"
                >
                  Logout
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
