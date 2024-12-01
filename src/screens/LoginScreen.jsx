import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decode as atob } from "base-64";
import { FaEye, FaEyeSlash, FaLock, FaLockOpen } from "react-icons/fa";
import { motion } from "framer-motion";
//import "../styles/LoginScreen.css";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hidePass, setHidePass] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [userName, setUserName] = useState("");
    const [fadeAnimState, setFadeAnimState] = useState(0);

    const buttonScale = useRef(1);
    //const fadeAnim = useRef(0);
    const [lockAnim, setLockAnim] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setFadeAnimState(1);
    }, []);

    const decodeJWT = (token) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = atob(base64);
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error al decodificar el JWT:", error);
            return null;
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                { email, password }
            );

            if (response.data && response.data.token) {
                const { token } = response.data;
                console.log("Token recibido:", token); 
                localStorage.setItem("token", token);

                const decoded = decodeJWT(token);
                console.log("Token decodificado:", decoded); // Verifica la decodificación

                if (!decoded || !decoded.role) {
                    setAlertMessage("Error al obtener el rol del usuario.");
                    setAlertType("error");
                    setTimeout(() => setAlertMessage(null), 3000);
                    return;
                }

                setUserName(decoded.nombre || "Usuario");
                setLoginSuccess(true);
                setLockAnim(1); // Actualiza el estado para animar el candado
                setIsUnlocked(true);

                setTimeout(() => {
                    if (decoded.role === "Administrador") {
                        navigate("/admin-dashboard");
                    } else if (decoded.role === "Trabajador") {
                        navigate("/worker-dashboard");
                    }
                }, 1500);
            } else {
                setAlertMessage("No se recibió token en la respuesta.");
                setAlertType("error");
                setTimeout(() => setAlertMessage(null), 3000);
            }
        } catch (error) {
            setAlertMessage("Error al iniciar sesión");
            setAlertType("error");
            setTimeout(() => setAlertMessage(null), 3000);
        }
    };

    const handlePressIn = () => {
        buttonScale.current = 0.95;
    };

    const handlePressOut = () => {
        buttonScale.current = 1;
    };

    return (
        <div style={styles.logcontainer}>
            <div style={{ ...styles.headerContainer, opacity: fadeAnimState }}>
                <h1 style={styles.title}>Joyería</h1>
                <h2 style={styles.subtitle}>López</h2>
            </div>

            {loginSuccess ? (
                <div>
                    <motion.div
                        initial={{ rotateZ: 0, y: 0 }} // Posición inicial (cerrado y sin movimiento)
                        animate={
                            isUnlocked
                                ? { rotateZ: -45, y: 0 }
                                : { rotateZ: 0, y: 0 }
                        } // Animación al desbloquear
                        transition={{ duration: 0.5, ease: "easeInOut" }} // Duración y suavidad de la animación
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {isUnlocked ? (
                            <FaLockOpen size={30} color="#d4af37" />
                        ) : (
                            <FaLock size={30} color="#d4af37" />
                        )}
                    </motion.div>
                    <p style={styles.welcomeText}>Hola, {userName}</p>
                </div>
            ) : (
                <div
                    style={{ ...styles.formContainer, opacity: fadeAnimState }}
                >
                    {alertMessage && (
                        <div
                            style={
                                alertType === "error"
                                    ? styles.errorAlert
                                    : styles.successAlert
                            }
                        >
                            <p style={styles.alertText}>{alertMessage}</p>
                        </div>
                    )}
                    <label style={styles.text} htmlFor="email">
                        Correo electrónico:
                    </label>
                    <div style={styles.inputContainer}>
                        <input
                            id="email"
                            style={styles.input}
                            placeholder="Correo electrónico"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            aria-label="Correo electrónico"
                        />
                    </div>
                    <label style={styles.text} htmlFor="password">
                        Contraseña:
                    </label>
                    <div style={styles.inputContainer}>
                        <input
                            id="password"
                            style={styles.input}
                            placeholder="Contraseña"
                            type={hidePass ? "password" : "text"}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            aria-label="Contraseña"
                        />
                        <button
                            style={styles.icon}
                            onClick={() => setHidePass(!hidePass)}
                            aria-label="Mostrar/ocultar contraseña"
                        >
                            {hidePass ? (
                                <FaEyeSlash size={20} />
                            ) : (
                                <FaEye size={20} />
                            )}
                        </button>
                    </div>
                    <div style={styles.buttonContainer}>
                        <button
                            style={{
                                ...styles.loginButton,
                                transform: `scale(${buttonScale.current})`,
                            }}
                            onMouseDown={handlePressIn}
                            onMouseUp={handlePressOut}
                            onClick={handleLogin}
                            aria-label="Iniciar sesión"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    logcontainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
    },
    headerContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 54,
        fontStyle: "italic",
        color: "#f5c469",
        marginBottom: -10,
    },
    subtitle: {
        fontSize: 42,
        fontStyle: "italic",
        color: "#f5c469",
    },
    formContainer: {
        width: "85%",
        maxWidth: 400,
        backgroundColor: "#1a1a1a",
        borderRadius: 15,
        padding: 20,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.6)",
        elevation: 12,
        display: "flex",
        flexDirection: "column",
    },
    text: {
        color: "#f5c469",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    inputContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#444",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 15, // Aumenta separación entre campos
        padding: 5,
        backgroundColor: "#ffffff",
        boxShadow: "0px 5px 15px rgba(255, 99, 71, 0.3)",
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        color: "#000000",
        border: "none", // Remueve bordes innecesarios
    },
    icon: {
        padding: 10,
        color: "#1a1a1a",
        backgroundColor: "#f5c469",
        maxWidth: "12%",
        height: 40,
    },
    buttonContainer: {
        width: "100%",
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButton: {
        backgroundColor: "#d4af37",
        padding: 14,
        marginLeft: "10%",
        width: "80%", // Reduce el ancho para un diseño más limpio
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 5px 15px rgba(255, 99, 71, 0.3)",
    },
    loginButtonText: {
        color: "#000",
        fontWeight: "bold",
    },
    welcomeText: {
        color: "#ffff",
    },
};

export default LoginScreen;
