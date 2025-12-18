using ApiFinançasProject.Dtos;
using ApiFinançasProject.Models;
using ApiFinançasProject.Exceptions;
using ApiFinançasProject.Data;
using Microsoft.EntityFrameworkCore;

namespace ApiFinançasProject.Services;

public class FinancialService : IFinancialService
{
    private readonly AppDbContext _context;

    public FinancialService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Person> CreatePersonAsync(Person person)
    {
        _context.People.Add(person);
        await _context.SaveChangesAsync();
        return person;
    }

    public async Task<List<Person>> GetPeopleAsync()
    {
        return await _context.People.ToListAsync();
    }

    public async Task DeletePersonAsync(int id)
    {
        var person = await _context.People.FindAsync(id);
        if (person == null)
            throw new KeyNotFoundException("Pessoa não encontrada.");

        _context.People.Remove(person);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteTransactionAsync(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
            throw new KeyNotFoundException("Transação não encontrada.");

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
    }

    public async Task<Category> CreateCategoryAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<List<Category>> GetCategoriesAsync()
    {
        return await _context.Categories.ToListAsync();
    }

    // --- LÓGICA DE NEGÓCIO ---
    public async Task<Transaction> CreateTransactionAsync(CreateTransactionDto dto)
    {
        var person = await _context.People.FindAsync(dto.PersonId);
        if (person == null)
            throw new KeyNotFoundException("Pessoa não encontrada.");

        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null)
            throw new KeyNotFoundException("Categoria não encontrada.");

        // Regra: Menor de idade
        if (person.Age < 18 && dto.Type == TransactionType.Income)
        {
            throw new DomainException("Menores de 18 anos só podem registrar Despesas.");
        }

        // Regra: Categoria x Tipo (Both = Ambas)
        if (category.Scope != CategoryScope.Both)
        {
            if ((int)category.Scope != (int)dto.Type)
            {
                throw new DomainException($"A categoria '{category.Description}' não aceita este tipo de lançamento.");
            }
        }

        var transaction = new Transaction
        {
            Description = dto.Description,
            Value = dto.Value,
            Type = dto.Type,
            CategoryId = dto.CategoryId,
            PersonId = dto.PersonId
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return transaction;
    }

    public async Task<List<Transaction>> GetTransactionsAsync()
    {
        return await _context.Transactions
            .Include(t => t.Person)
            .Include(t => t.Category)
            .ToListAsync();
    }

    // 1. Relatório de Categorias 
    public async Task<object> GetCategoryReportAsync()
    {
        var report = await _context.Categories
            .Select(c => new
            {
                Category = c.Description,

                Income = _context.Transactions
                    .Where(t => t.CategoryId == c.Id && t.Type == TransactionType.Income)
                    .Sum(t => t.Value),

                Expense = _context.Transactions
                    .Where(t => t.CategoryId == c.Id && t.Type == TransactionType.Expense)
                    .Sum(t => t.Value),

                Balance = _context.Transactions
                    .Where(t => t.CategoryId == c.Id && t.Type == TransactionType.Income).Sum(t => t.Value) -
                          _context.Transactions
                    .Where(t => t.CategoryId == c.Id && t.Type == TransactionType.Expense).Sum(t => t.Value)
            })
            .ToListAsync();

        var totalIncome = report.Sum(r => r.Income);
        var totalExpense = report.Sum(r => r.Expense);

        return new
        {
            Details = report,
            GrandTotal = new
            {
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                NetBalance = totalIncome - totalExpense
            }
        };
    }

    // 2. Relatório de Pessoas
    public async Task<object> GetPersonReportAsync()
    {
        var report = await _context.People
            .Include(p => p.Transactions)
            .Select(p => new
            {
                Person = p.Name,

                Income = p.Transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Value),

                Expense = p.Transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Value),

                Balance = p.Transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Value) -
                        p.Transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Value)
            })
            .ToListAsync();

        var totalIncome = report.Sum(r => r.Income);
        var totalExpense = report.Sum(r => r.Expense);

        return new
        {
            Details = report,
            GrandTotal = new
            {
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                NetBalance = totalIncome - totalExpense
            }
        };
    }
}