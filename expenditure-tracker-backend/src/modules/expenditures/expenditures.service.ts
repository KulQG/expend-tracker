import { IExpendituresRepository } from "./expenditures.repository";

export class ExpendituresService {
  constructor(private readonly repo: IExpendituresRepository) {}

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.repo.findMany(skip, limit),
      this.repo.count(),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: { name: string; sum: number; date: string }) {
    return this.repo.create({
      name: data.name,
      sum: data.sum,
      date: new Date(data.date),
    });
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
