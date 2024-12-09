import { Col, Container, Row } from "react-bootstrap";
import { ReactNode } from "react";  // Import ReactNode

interface FormContainerProps {
  children: ReactNode;  // Specify the type of children as ReactNode
}

const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
