import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import Menu from "../../components/Menu";
import Modal from "../../components/Modal";
import styles from "./styles.module.css";
import axios from "axios";
import Header from "../../components/Header";
import Message from "../../components/Message";
import { useNavigate, useParams } from "react-router-dom";
import { addTask, completeTask, getAllTasks, removeTasks } from "./service.module";
import { getOneWork } from "../Home/service.module";
import IconTasksOk from '../../utils/icons/task-ok.svg';
import IconTasksWorking from '../../utils/icons/task-working.svg';
import IconBtnTaskWorking from '../../utils/icons/btn-task-working.svg';
import IconBtnTaskOk from '../../utils/icons/btn-task-ok.svg';
import IconBtnTaskRemove from '../../utils/icons/btn-task-remove.svg';
import IconBtnReturn from '../../utils/icons/btn-return.svg';

interface ITasks {
    id?: string;
    title?: string;
    status?: boolean;
}

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [showTasks, setShowTasks] = useState([]);
    const [work, setWork] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskCompleate, setTaskCompleate] = useState([]);
    const [taskInProgress, setTaskInProgress] = useState([]);
    const [optFilterTasks, setOptFilterTasks] = useState(1);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [showStatusMessage, setShowStatusMessage] = useState('success')
    const { work_id } = useParams();
    const navigate = useNavigate();

    const handleAllTasks = async () => {
        const tasks = await getAllTasks(work_id).then(res => {
            return res
        })

        setTasks(tasks.data);
        getFilterTasks();
    }

    const handleGetWork = async () => {
        const work = await getOneWork(work_id).then(res => {
            return res.data.title
        })

        setWork(work)
    }

    const getFilterTasks = () => {
        const completeTasks = tasks.filter((task: ITasks) => task.status === true)
        const inProgressTasks = tasks.filter((task: ITasks) => task.status === false)
        setTaskCompleate(completeTasks)
        setTaskInProgress(inProgressTasks)
    }

    const handleFilterTasks = (opt: number) => {
        setOptFilterTasks(opt)
        getFilterTasks()
        
        switch(opt) {
            case 1: setShowTasks(tasks)
            break;
            case 2: setShowTasks(taskCompleate)
            break;
            case 3: setShowTasks(taskInProgress)
        }
    }

    const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(event.target.value)
    }

    const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskDescription(event.target.value)
    }

    const validateMessage = (message: string, status: string, show: boolean) => {
        setMessage(message);
        setShowStatusMessage(status);
        setShowMessage(show);
    }

    const handleUpdateStatus = async (task_id: string, status: boolean | undefined) => {
        if (status === false) {
            validateMessage('', '', false);
            await completeTask(task_id, status).then(res => {
                handleAllTasks()
                handleFilterTasks(optFilterTasks)
                validateMessage(res.message, 'success', true)
            }).catch(() => {
                validateMessage("Não foi possível Concluir a Tarefa", 'danger', true);
            })
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        validateMessage('', '', false);

        const task = {
            title: taskTitle,
            description: taskDescription,
            work_id
        }

        await addTask(task).then(res => {
            handleAllTasks();
            validateMessage(res.data.message, 'success', true);
        }).catch(() => {
            validateMessage("Não foi possível Adicionar a Tarefa!!", 'success', true);
        })
    }

    const handleRemoveTask = async (task_id: string) => {
        validateMessage('', '', false);
        await removeTasks(task_id).then(res => {
            validateMessage(res.message, 'success', true)
            handleAllTasks()
            setTaskTitle('');
            setTaskDescription('');
        }).catch(() => {
            validateMessage("Não foi possível Remover a Tarefa!!", 'success', true);
        })
    }

    useEffect(() => {
        handleAllTasks()
        handleGetWork()
    }, [])

    useEffect(() => {
        handleFilterTasks(optFilterTasks)
        getFilterTasks()
    }, [tasks])
    return (
        <>
            <Menu />
            <div className={styles.home}>
                <Container>
                    <Header title={`${work} - Tarefas`} subtitle="Lista com Todas as tarefas do Trabalho" />
                </Container>
            </div>

            <div className={styles.works}>
                <Container>
                    <Row>
                        <Message title={message} status={showStatusMessage} show={showMessage} />
                        <Col md={12} className={styles.tasks}>
                            <Row className={styles.tasks_header}>
                                <Col md={6} className="d-flex justify-content-start">
                                    {tasks.length > 0 && (
                                        <p>
                                            <strong>{taskCompleate.length}</strong> | <strong>{tasks.length}</strong> Tarefas Concluídas
                                        </p>
                                    )}
                                </Col>

                                <Col md={6} className="d-flex justify-content-end">
                                    <Button className="btn btn-link" style={{ marginRight: 5, marginLeft: 10 }}
                                        onClick={() => navigate(-1)}>
                                        <img src={IconBtnReturn} />
                                    </Button>

                                    <Modal title="Adicionar Tarefa">
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Titulo</Form.Label>
                                                <Form.Control type="text" placeholder="Digite o Título da Tarefa"
                                                    value={taskTitle} onChange={onChangeTitle}
                                                    required />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="description">
                                                <Form.Label>Descrição</Form.Label>
                                                <Form.Control as="textarea"
                                                    rows={3} onChange={onChangeDescription} />
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

                            <Row>
                                <Col md={6} key={"inline-radio"} className="d-flex p-2">
                                    <Form.Check
                                        type="radio"
                                        label={"Todos"}
                                        id={'opt-1'}
                                        name={"filter_task"}
                                        defaultChecked={optFilterTasks === 1 ? true : false}
                                        inline
                                        onClick={() => handleFilterTasks(1)}
                                    />

                                    <Form.Check
                                        type="radio"
                                        label="Concluídos"
                                        id={'opt-2'}
                                        name={"filter_task"}
                                        inline
                                        defaultChecked={optFilterTasks === 2 ? true : false}
                                        onClick={() => handleFilterTasks(2)}
                                    />

                                    <Form.Check
                                        type="radio"
                                        label="Em Progressos"
                                        id={'opt-3'}
                                        name={"filter_task"}
                                        inline
                                        defaultChecked={optFilterTasks === 3 ? true : false}
                                        onClick={() => handleFilterTasks(3)}
                                    />
                                </Col>
                                {
                                    tasks.length > 0 ? (
                                        showTasks.map((task: ITasks) =>
                                            <ListGroup key={task.id}>
                                                <ListGroup.Item as="li"
                                                    className="d-flex justify-content-between align-items-start"
                                                    style={{ marginLeft: 10, marginBottom: 10, padding: 10 }}
                                                    variant={`${task.status == true ? 'success' : ''}`}
                                                >
                                                    <div className="ms-2 me-auto">
                                                        <img src={`${task.status === true ? IconTasksOk : IconTasksWorking} `} width={30} className="rounded-circle" />
                                                        <span className={styles.taskTitle}>{task.title}</span>
                                                    </div>

                                                    <Badge bg="Link" pill>
                                                        <Button className="btn btn-warning" onClick={() => handleUpdateStatus(task.id !== undefined ? task.id : '', task.status)}>

                                                            {
                                                                task.status === true ? (
                                                                    <img src={IconBtnTaskOk} />
                                                                ) :
                                                                    <img src={IconBtnTaskWorking} />
                                                            }
                                                        </Button>

                                                        <Button className="btn btn-danger" style={{ marginRight: 5, marginLeft: 10 }}
                                                            onClick={() => handleRemoveTask(task.id !== undefined ? task.id : '')}>
                                                            <img src={IconBtnTaskRemove} />
                                                        </Button>
                                                    </Badge>
                                                </ListGroup.Item>

                                            </ListGroup>)
                                    ) :
                                        <h4> Você não possui Tarefas Cadastradas</h4>
                                }
                            </Row>

                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}