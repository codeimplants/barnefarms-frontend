import { Alert } from 'react-bootstrap';

// Define the prop types for Message component
interface MessageProps {
  variant?: string;
  children?: React.ReactNode; // Children can be any valid React node (string, JSX, etc.)
}

const Message = ({ variant, children }: MessageProps) => {
  return (
    <Alert variant={variant}>{children}</Alert>
  );
};

// Default props
Message.defaultProps = {
  variant: 'info',
};

export default Message;
