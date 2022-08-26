import { useContext, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/Auth/AuthContext";
import BannerLogin from '../../utils/images/banner-login.jpg';
import styles from './styles.module.css';

export default function SignIn() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    
    const onChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value)
    }

    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(login && password) {
            const isLogged = await auth.signin(login, password);
            console.log(isLogged)
            if(isLogged) {
                navigate("/works");
            }else {
                alert("Mensagem de Error!!")
            }
        }
    }

    return (
        <Container>
            <Row>
                <Col md={6} className="align-self-center">
                    <h3 className={styles.title}> Todo List </h3>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Login | Email</Form.Label>
                            <Form.Control   type="text" 
                                            placeholder="Digite seu Login ou Email" 
                                            value={login} 
                                            onChange={onChangeLogin} 
                                            required/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control   type="password" 
                                            placeholder="Digite sua Senha" 
                                            value={password} 
                                            onChange={onChangePassword} 
                                            required/>
                        </Form.Group>

                        <Button variant="primary" type="submit" className={styles.button}>
                            Logar
                        </Button>
                    </Form>

                    <p className={styles.register}>Não tem Cadastro | Crie Aqui!</p>
                </Col>

                <Col md={6}>
                    <Image src={BannerLogin} fluid={true} />
                </Col>
            </Row>
        </Container>
    )
}