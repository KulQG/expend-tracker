import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Button, Input, Field, NumberInput } from "@chakra-ui/react";
import { useExpendituresStore } from "../../stores/useExpendituresStore";
import dayjs from "dayjs";

const schema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  sum: z.number().min(1, "Сумма должна быть больше 0").max(1_000_000, "сумма должна не более 1 000 000"),
  date: z.string().min(1, "Дата обязательна"),
});

type FormValues = z.infer<typeof schema>;

export const ExpenditureForm = () => {
  const create = useExpendituresStore((state) => state.create);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await create({ ...data, date: dayjs(data.date).toISOString() });
      reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.details) {
        Object.entries(err.details).forEach(([field, message]) => {
          setError(field as keyof FormValues, {
            type: "server",
            message: String(message),
          });
        });
      }
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      gap="4"
      alignItems="flex-start"
      justifyContent="center"
      mb="6"
      mt={10}
    >
      <Field.Root invalid={!!errors.name}>
        <Field.Label mb="1">Название</Field.Label>
        <Input {...register("name")} />
        <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.sum}>
        <Field.Label mb="1">Сумма</Field.Label>
        <NumberInput.Root
          min={0}
          minWidth={'100%'}
          max={1_000_000}
          onValueChange={(details) =>
            setValue("sum", details.valueAsNumber || 0)
          }
        >
          <NumberInput.Input />
        </NumberInput.Root>
        <Field.ErrorText>{errors.sum?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.date}>
        <Field.Label mb="1">Дата</Field.Label>
        <Input type="date" {...register("date")} />
        <Field.ErrorText>{errors.date?.message}</Field.ErrorText>
      </Field.Root>

      <Button type="submit" loading={isSubmitting} colorPalette="blue" px="8" mt={'29px'}>
        Добавить
      </Button>
    </Flex>
  );
};
