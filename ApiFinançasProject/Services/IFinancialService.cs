using ApiFinançasProject.Dtos;
using ApiFinançasProject.Models;
using ApiFinançasProject.Services;

namespace ApiFinançasProject.Services;

public interface IFinancialService
{
    // Pessoas
    Task<Person> CreatePersonAsync(Person person);
    Task<List<Person>> GetPeopleAsync();
    Task DeletePersonAsync(int id);

    // Categorias
    Task<Category> CreateCategoryAsync(Category category);
    Task<List<Category>> GetCategoriesAsync();

    // Transações
    Task<Transaction> CreateTransactionAsync(CreateTransactionDto dto);
    Task<List<Transaction>> GetTransactionsAsync();

    // Relatórios 
    Task<object> GetPersonReportAsync();

    Task DeleteTransactionAsync(int id);
    Task<object> GetCategoryReportAsync();
}