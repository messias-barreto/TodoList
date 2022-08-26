import { Card, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from './card.module.css';

interface IProps { 
    title: string;
    text: string;
    link?: string;
    funcao?: () => void; 
    children?: React.ReactNode;
    footer?: JSX.Element;
}

export default function ICard ({title, text, funcao, footer, link}: IProps) {
    return (
        <Card style={{ width: '18rem', textAlign: 'center', marginBottom: '20px' }} className={styles.card} onClick={funcao}>
        <Link to={link !== undefined ? link : '#'} style={{ textDecoration: 'none', color: '#000' }}>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            tarefas: {text}
          </Card.Text>
        </Card.Body>
        </Link>
        <Card.Footer>
          {footer}
        </Card.Footer>
      </Card>
    )
}