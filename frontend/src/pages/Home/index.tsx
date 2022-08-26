import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Offcanvas, ProgressBar, Row } from "react-bootstrap";
import ICard from "../../components/Card";
import Menu from "../../components/Menu";
import Modal from "../../components/Modal";
import styles from "./styles.module.css";
import axios from "axios";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Contexts/Auth/AuthContext";
import { getToken } from "../../hooks/localstorage";
import { addWork, getAllWorks, removeWork } from "./service.module";
import Message from "../../components/Message";
import IconBtnTaskRemove from '../../utils/icons/btn-task-remove.svg';
const url = 'http://127.0.0.1:3200';

interface IWork {
    id?: string;
    title?: string;
    description?: string;
    status: boolean;
    qtd_task: number;
    qtd_complete: number;
}

export default function Home() {
    const [works, setWorks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [showInfo, setShowInfo] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [showStatusMessage, setShowStatusMessage] = useState('success')
    const [remove, setRemove] = useState(false)
    const user = useContext(AuthContext);

    const handleGetTotalPercent = (compleate: number, total: number) => {
        let totalWorks = total
        let compleatWorks = compleate

        let result = (compleatWorks * 100) / totalWorks
        if (isNaN(result)) { return 0 }
        return result
    }

    const validateMessage = (message: string, status: string, show: boolean) => {
        setMessage(message);
        setShowStatusMessage(status);
        setShowMessage(show);
    }

    const handleWorks = async () => {
        const works = await getAllWorks(user.user?.id).then(res => {
            return res.data
        })

        setWorks(works);
    }

    // const handleTasks = async (id: string) => {
    //     const token = await getToken();
    //     const headers = {
    //         headers: { 'Authorization': `Bearer ${token}` }
    //     }
    //     await axios.get(`${url}/tasks/${id}`, headers).then(res => setTasks(res.data.data))
    // }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        validateMessage('', '', false);
        event.preventDefault();
        const work = {
            title,
            description,
            user_id: user.user?.id
        }

        await addWork(work).then(res => {
            handleWorks();
            validateMessage(res.data.message, 'success', true);
        }).catch(() => {
            validateMessage("Não foi possível Adicionar o Trabalho!!", 'danger', true);
        })
    }

    const handleRemoveWork = async (id: string) => {
        validateMessage('', '', false);

        await removeWork(id).then(res => {
            handleWorks();
            validateMessage(res.data.message, 'success', true);
        }).catch(() => {
            validateMessage("Não foi possível Remover o Trabalho!!", 'danger', true);
        })
    }

    useEffect(() => {
        handleWorks()
    }, [])
    return (
        <>
            <Menu />
            <Message title={message} status={showStatusMessage} show={showMessage} />
            <div className={styles.home}>
                <Container>
                    <Header title="Trabalhos" subtitle="Confira aqui todos os trabalhos adicionados até agora" />
                </Container>
            </div>

            <div className={styles.works}>
                <Container className={styles.container}>
                    <Row>
                        <Col className="d-flex flex-row-reverse bd-highlight">

                            <Button variant={`${remove === true ? "outline-danger" : "outline-success" }`} style={{ marginLeft: 10 }}
                                onClick={() => setRemove(remove === true ? false : true)}>
                                <img src={IconBtnTaskRemove} />
                            </Button>

                            <Modal title="Novo Trabalho">
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Titulo</Form.Label>
                                        <Form.Control type="text" placeholder="Digite o Título da Tarefa"
                                            value={title} onChange={(event) => setTitle(event.target.value)}
                                            required />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="description">
                                        <Form.Label>Descrição</Form.Label>
                                        <Form.Control as="textarea"
                                            rows={3} onChange={(event) => setDescription(event.target.value)} />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" style={{ marginRight: 10 }}>
                                        Adicionar
                                    </Button>

                                    <Button variant="danger">
                                        Cancelar
                                    </Button>
                                </Form>
                            </Modal>

                            {/* <Button variant="outline-danger" 
                                    onClick={() => setRemove(remove === true ? false : true)}>
                                        <img src={IconBtnTaskRemove} />
                            </Button> */}
                        </Col>
                    </Row>

                    <Row style={{ marginTop: 20 }}>
                        {
                            works.map((work: IWork) =>
                                <Col md={4} className={styles.works} key={work.id}>
                                    <ICard key={work.id}
                                        link={`/tasks/${work.id}`}
                                        title={`${work.title}`}
                                        text={`${work.qtd_complete} | ${work.qtd_task}`}
                                        footer={
                                            remove === true ? (
                                                <Button variant="outline-danger"
                                                    onClick={() => handleRemoveWork(work.id !== undefined ? work.id : '')}>
                                                    <img src={IconBtnTaskRemove} />
                                                </Button>
                                            ) :

                                                <ProgressBar
                                                    now={handleGetTotalPercent(work.qtd_complete, work.qtd_task)}
                                                    label={`${handleGetTotalPercent(work.qtd_complete, work.qtd_task)?.toFixed(1)}%`} />
                                        } />
                                </Col>
                            )
                        }
                    </Row>
                </Container>
            </div>
        </>
    )
}