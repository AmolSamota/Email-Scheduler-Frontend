import { Helmet } from "react-helmet";
import Login from "../components/Login";
import { MdMailOutline } from "react-icons/md";
import { AiFillGooglePlusCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import firebase from "../firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner } from "react-bootstrap";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { token } = useSelector((state) => ({ ...state.auth }));
    // useEffect(() => {
    //     if (token) history.push("/");
    // }, [token, history]);
    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                // Signed in
                setLoading(false);
                var user = userCredential.user;
                const idToken = await user.getIdToken();
            })
            .catch((error) => {
                setLoading(false);
                var errorMessage = error.message;
                toast.error(errorMessage);
            });
    };
    const loginForm = (
        <form>
            <input
                className="form-control"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
                className="form-control"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <Button
                type="primary"
                shape="round"
                size="large"
                block
                disabled={!email || password.length < 6}
                onClick={submitHandler}
            >
                <MdMailOutline
                    style={{ verticalAlign: "-2px" }}
                ></MdMailOutline>{" "}
                Login with Email and Password
            </Button>
            <br />
        </form>
    );
    const googleHandler = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then(async (result) => {
                // Auth state is automatically set in Redux , due to onAuthChanged event handled in App.js
                // const idToken = result.credential.idToken;
                const user = result.user;
                const idToken = await user.getIdToken();
            })
            .catch((error) => {
                var errorMessage = error.message;
                toast.error(errorMessage);
            });
    };
    return (
        <div className="container p-5">
            <Helmet>
                <title>Login Page</title>
            </Helmet>
            <Login />
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ? (
                        <div
                            style={{
                                textAlign: "center",
                            }}
                        >
                            <Spinner animation="border" role="status" size="lg">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <>
                            <h3>Login</h3>
                            {loginForm}
                            <br />
                            <Button
                                type="danger"
                                size="large"
                                block
                                shape="round"
                                onClick={googleHandler}
                            >
                                <AiFillGooglePlusCircle
                                    style={{ verticalAlign: "-2px" }}
                                ></AiFillGooglePlusCircle>{" "}
                                Login with Google
                            </Button>
                            <br />
                            <Link
                                to="/forgot/password"
                                className="float-end text-danger"
                            >
                                Forgot Password?
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
