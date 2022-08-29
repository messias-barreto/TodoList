import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Offcanvas, Pagination, ProgressBar, Row } from "react-bootstrap";
import ICard from "../../components/Card";
import Menu from "../../components/Menu";
import Modal from "../../components/Modal";
import styles from "./styles.module.css";
import Header from "../../components/Header";
import { AuthContext } from "../../Contexts/Auth/AuthContext";
import { addWork, getAllWorks, removeWork } from "./service.module";
import Message from "../../components/Message";
import IconBtnTaskRemove from '../../utils/icons/btn-task-remove.svg';
import IPagination from "../../components/Pagination";

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
    const [filterWorks, setFilterWorks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [showStatusMessage, setShowStatusMessage] = useState('success');
    const [remove, setRemove] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const user = useContext(AuthContext);

    const handleGetTotalPercent = (compleate: number, total: number) => {
        let totalWorks = total
        let compleatWorks = compleate

        let result = (compleatWorks * 100) / totalWorks
        if (isNaN(result)) { return 0 }
        return result
    }

    const handleGetPaginate = async () => {
        let interval = page * 6;
        let start = interval - 6;
        let filtrado: never[] = [];

        works.forEach((value, index) => {
            if (index >= start && index < interval) {
                filtrado.push(value)
            }
        });

        setFilterWorks(filtrado);
        setTotalPages(Math.ceil(works.length / 6));
    }

    const validateMessage = (message: string, status: string, show: boolean) => {
        setMessage(message);
        setShowStatusMessage(status);
        setShowMessage(show);
    }

    const handleWorks = async () => {
        const works = await getAllWorks(user.user?.id, page).then(res => {
            return res.data
        })

        setWorks(works);
    }

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

    useEffect(() => {
        handleGetPaginate()
    }, [works, page])
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

                            <Button variant={`${remove === true ? "outline-danger" : "outline-success"}`} style={{ marginLeft: 10 }}
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
                        </Col>
                    </Row>

                    <Row style={{ marginTop: 20 }}>
                        {
                            filterWorks.map((work: IWork) =>
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

                        {
                            works.length === 0 && (
                                <Col className="d-flex justify-content-center align-self-end">
                                    <h3> Você não possui trabalhos cadastrados!!</h3>
                                </Col>
                            )
                        }
                    </Row>

                    <Row>
                        {
                            totalPages > 1 && (
                                <Col className="d-flex justify-content-center align-self-end">
                                    <IPagination totalPages={totalPages} page={page} selectPage={setPage} />
                                </Col>
                            )
                        }
                    </Row>
                </Container>
            </div>
        </>
    )
}