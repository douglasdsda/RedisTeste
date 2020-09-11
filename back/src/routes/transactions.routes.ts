import { Router } from 'express';
import multer from 'multer';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import uploadConfig from '../config/upload';
import ImportTransactionsService from '../services/ImportTransactionsService';
import RedisCacheProvider from '../provider/CacheProivider/implementations/RedisCacheProvider';

const transactionsRouter = Router();
const cacheProvider = new RedisCacheProvider();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  let transationsAndBalance = await cacheProvider.recover<any>(
    'transations-balance-list:all',
  );

  if (!transationsAndBalance) {
    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance();
    const objTransationsAndBalance = { transactions, balance };

    transationsAndBalance = { ...objTransationsAndBalance };

    await cacheProvider.save('transations-balance-list:all', {
      ...objTransationsAndBalance,
    });
    console.log('teste 1');
  }

  return response.json(transationsAndBalance);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  await cacheProvider.invalidate('transations-balance-list:all');

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute(id);

  await cacheProvider.invalidate('transations-balance-list:all');

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const updateUserAvatarService = new ImportTransactionsService();

    const transaction = await updateUserAvatarService.execute(
      request.file.path,
    );

    await cacheProvider.invalidate('transations-balance-list:all');

    return response.json(transaction);
  },
);

export default transactionsRouter;
