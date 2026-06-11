import { Container } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNetworkStore } from "../../stores/useNetworkStore";

export const Header = () => {
  const { isOnline, isServerHealthy, isPending, checkHealth } =
    useNetworkStore();

  useEffect(() => {
    if (!isPending && isServerHealthy === undefined) {
      checkHealth();
    }
  }, [checkHealth, isPending, isServerHealthy]);

  const getServerState = () => {
    if (isServerHealthy === undefined || isPending) return "Загрузка...";
    return isServerHealthy ? "Сервер работает" : "Сервер недоступен";
  };

  return (
    <header>
      <Container
        display={"flex"}
        mt={'10'}
        style={{ gap: "20px", justifyContent: "center" }}
      >
        <p>{isOnline ? "онлайн" : "оффлайн"}</p>
        <p>{getServerState()}</p>
      </Container>
    </header>
  );
};
