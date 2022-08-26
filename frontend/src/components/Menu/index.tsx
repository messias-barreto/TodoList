import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function Menu() {
    return (
        <Navbar bg="primary" variant="dark">
            <Container fluid>
                <Navbar.Brand href="/home">Todo List</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Trabalhos</Nav.Link>
                        <Nav.Link href="#link">Lista de Amigos</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}