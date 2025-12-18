namespace ApiFinançasProject.Models;

    public enum CategoryScope
{
    Expense = 0, // Apenas despesa
    Income = 1,  // Apenas receita
    Both = 2     // Ambas
}

    public class Category
{
    public int Id { get; set; }
    public required string Description { get; set; }
    public CategoryScope Scope { get; set; }
}