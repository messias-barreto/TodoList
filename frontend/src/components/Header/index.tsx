import { Col, Row } from "react-bootstrap";
import styles from './styles.module.css';
interface IProps {
    title: string;
    subtitle?: string;
}

export default function Header({title, subtitle}: IProps) {
    return (
        <Row>
            <Col>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.subtitle}>{subtitle}</p>
            </Col>
        </Row>
    )
}