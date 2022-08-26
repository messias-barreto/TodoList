import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

//ICONES 
import IconSuccess from '../../utils/icons/success.svg';
import IconWarning from '../../utils/icons/warning.svg';
import IconError from '../../utils/icons/error.svg';

interface IProps {
    title: string;
    status: string;
    show: boolean;
}

export default function Message({ title, status, show }: IProps) {
    const [showMessage, setShowMessage] = useState(show);

    useEffect(() => {
        setShowMessage(show)
    }, [show])

    return (
        <ToastContainer position='top-end' style={{ marginTop: 15 }}>
            <Toast className={`btn btn-${status}`}
                show={showMessage}
                delay={3000}
                onClose={() => setShowMessage(false)}
                autohide={true}>
                <Toast.Body>
                    <span style={{ marginRight: 8}}><img src={
                        `${status === 'success' ? IconSuccess :
                           status === 'warning' ? IconWarning :
                                                  IconError }`
                    } style={{width: 33}} /></span> {title}</Toast.Body>
            </Toast>

        </ToastContainer>
    );
}
