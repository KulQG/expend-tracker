import { PrismaClient } from "@prisma/client";

export interface IExpendituresRepository {
  findMany(skip: number, take: number): Promise<any[]>;
  count(): Promise<number>;
  create(data: { name: string; sum: number; date: Date }): Promise<any>;
  delete(id: number): Promise<any>;
}

export class ExpendituresRepository implements IExpendituresRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(skip: number, take: number) {
    return this.prisma.expenditure.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  async count() {
    return this.prisma.expenditure.count();
  }

  async create(data: { name: string; sum: number; date: Date }) {
    return this.prisma.expenditure.create({ data });
  }

  async delete(id: number) {
    return this.prisma.expenditure.delete({ where: { id } });
  }
}
