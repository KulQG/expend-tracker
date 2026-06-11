import { Header } from "./components/Header/Header";
import { ExpenditureForm } from "./components/ExpenditureForm/ExpenditureForm";
import { ExpendituresTable } from "./components/ExpenditureTable/ExpenditureTable";
import { useAppInit } from "./hooks/useAppInit";
import { Container } from "@chakra-ui/react";

export const App = () => {
  useAppInit(); // Вся магия сети, SSE и инициализации здесь

  return (
    <div>
      <Header />
      <Container mt="xl">
        <ExpenditureForm />
        <ExpendituresTable />
      </Container>
    </div>
  );
};
