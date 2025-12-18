export type TransactionType = 'Income' | 'Expense';
export type CategoryScope = 'Income' | 'Expense' | 'Both';

export interface Category {
    id: number;
    description: string;
    scope: CategoryScope;
}

export interface Person {
    id: number;
    name: string;
    age: number;
    // Não precisamos da lista de transactions aqui na listagem simples
}

export interface Transaction {
    id: number;
    description: string;
    value: number;
    type: TransactionType;
    categoryId: number;
    category?: Category;
    personId: number;
    person?: Person;
}

// Para usar nos formulários de criação (sem ID)
export interface CreatePersonDto {
    name: string;
    age: number;
}

export interface CreateTransactionDto {
    description: string;
    value: number;
    type: 'Income' | 'Expense';
    categoryId: number;
    personId: number;
}