import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (type === 'outcome') {
      const { total } = await transactionRepository.getBalance();

      if (value > total) {
        throw new AppError('Valor ultrapassa o total', 400);
      }
    }

    const categoryRepository = getRepository(Category);

    let categoryid = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryid) {
      categoryid = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryid);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryid,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
