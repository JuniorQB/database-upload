import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const idtransaction = await transactionRepository.findOne(id);
    if (!idtransaction) {
      throw new AppError('Transaction not found');
    }

    await transactionRepository.remove(idtransaction);
  }
}

export default DeleteTransactionService;
