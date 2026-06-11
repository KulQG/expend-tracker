import { useEffect } from "react";
import { useExpendituresStore } from "../../stores/useExpendituresStore";
import {
  Box,
  ButtonGroup,
  IconButton,
  Pagination,
  Table,
} from "@chakra-ui/react";
import { ArrowLeft, ArrowRight, Trash } from "lucide-react";

export const ExpendituresTable = () => {
  const { items, currentPage, totalPages, fetchPage, remove } =
    useExpendituresStore();

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return (
    <div>
      <Table.Root striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Название</Table.ColumnHeader>
            <Table.ColumnHeader>Сумма</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader>Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.length > 0 ? (
            items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.sum} руб.</Table.Cell>
                <Table.Cell>
                  {new Date(item.date).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <IconButton onClick={() => remove(item.id)}>
                    <Trash />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell
                colSpan={4}
                style={{ textAlign: "center", padding: "1.5rem" }}
              >
                Записи не найдены (офлайн режим пуст или нет данных)
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      {totalPages > 1 && (
        <Box mt="md">
          <Pagination.Root
            count={totalPages}
            pageSize={2}
            defaultPage={currentPage}
          >
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <ArrowLeft size={10} />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                    {page.value}
                  </IconButton>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton>
                  <ArrowRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Box>
      )}
    </div>
  );
};
