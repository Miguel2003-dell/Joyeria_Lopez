import React, { useState } from "react";
import styled from "styled-components";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { MyRoutes } from "./routers/routes"; // Importa las rutas
import { Light, Dark } from "./styles/Themes";
import { ThemeProvider } from "styled-components";

export const ThemeContext = React.createContext(null);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Controla el estado de autenticación
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          <AppContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const AppContent = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation(); // Obtiene la ruta actual

  const isLoginRoute = location.pathname === "/login"; // Verifica si estás en la ruta de login

  return (
    <>
      {/* Si estás en login, no renderizas el sidebar ni el container */}
      {isLoginRoute ? (
        <LoginWrapper>
          <MyRoutes /> {/* Aquí se renderizan todas las rutas */}
        </LoginWrapper>
      ) : (
        <Container className={sidebarOpen ? "sidebarState active" : ""}>
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <Content>
            <MyRoutes /> {/* Aquí se renderizan todas las rutas */}
          </Content>
        </Container>
      )}
    </>
  );
};

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* El login ocupa toda la pantalla */
  background: ${({ theme }) => theme.bgtotal};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  background: ${({ theme }) => theme.bgtotal};
  transition: all 0.5s;
  &.active {
    grid-template-columns: 300px auto;
  }
  color: ${({ theme }) => theme.text};
`;

const Content = styled.div`
  padding: 10px;
  overflow: auto;
`;

export default App;
