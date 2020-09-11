import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface CSVTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepositories = getRepository(Category);

    const contactsReadStream = fs.createReadStream(filePath);
    const parsers = csvParse({
      // delimiter: ';',
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const trasactions: CSVTransaction[] = [];

    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );
      if (!title || !type || !value) return;

      categories.push(category);

      trasactions.push({ title, type, value, category });
    });
    await new Promise(resolve => parseCSV.on('end', resolve));

    const existenCategories = await categoriesRepositories.find({
      where: {
        title: In(categories),
      },
    });

    const existenCategoriesTItle = existenCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitle = categories
      .filter(category => !existenCategoriesTItle.includes(category))
      .filter((value, index, self) => self.lastIndexOf(value) === index);

    const newCategories = categoriesRepositories.create(
      addCategoryTitle.map(title => ({
        title,
      })),
    );

    await categoriesRepositories.save(newCategories);

    const finalCategories = [...existenCategories];
    const createdTransactions = transactionsRepository.create(
      trasactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
