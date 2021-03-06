import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import HowItWorks from "../../HowItWorks";

const Inbox = () => {
    const { token, email } = useSelector((state) => state.auth);
    const [arr, setArr] = useState([]);
    const [loading, setLoading] = useState(false);
    function myFunction(value, index, array) {
        if (email !== value.email) return value.email;
    }

    useEffect(() => {
        setLoading(true);
        axios
            .get(process.env.REACT_APP_API_LINK + "/received-emails", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log(res.data, "emails");
                setArr(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, []);
    return (
        <Container>
            <Row>
                {loading ? (
                    <Spinner animation="border" role="status" size="lg">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                ) : (
                    <>
                        <Container>
                            <Row>
                                <HowItWorks />
                            </Row>
                        </Container>
                        {arr.length === 0 ? (
                            <></>
                        ) : (
                            <Container>
                                <Row>
                                    <Col>
                                        <h1 className="text-center">Inbox</h1>
                                    </Col>
                                </Row>
                            </Container>
                        )}

                        {arr.map((mail) => (
                            <>
                                <Card
                                    style={{
                                        width: "100%",
                                        margin: "10px",
                                        background: "#e1e2e3",
                                        color: "black",
                                    }}
                                >
                                    <Card.Body>
                                        <b>From:</b> {mail.sender.email}
                                        <br />
                                        <b>Received At:</b>{" "}
                                        {new Date(mail.createdAt)
                                            .toString()
                                            .substr(0, 33)}
                                        <br />
                                        <b>CC:</b>{" "}
                                        {mail.receivers.map(myFunction)}
                                        <br />
                                        <b>Subject:</b> {mail.subject}
                                        <Card.Text>{mail.body}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </>
                        ))}
                    </>
                )}
            </Row>
        </Container>
    );
};

export default Inbox;
