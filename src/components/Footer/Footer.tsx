import { Col, Container, Row } from "react-bootstrap"


const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer>
        <Container>
            <Row>
                <Col className="text-center py-3" >
                    <p>Subzi Wala &copy; {currentYear}</p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer