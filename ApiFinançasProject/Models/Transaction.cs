namespace ApiFinançasProject.Models;
using System.ComponentModel.DataAnnotations;

public enum TransactionType
    {
        Expense = 0,
        Income = 1
    }

    public class Transaction
    {
        public int Id { get; set; }
        public required string Description { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser positivo e maior que zero.")]
        public decimal Value { get; set; } 
        public TransactionType Type { get; set; }

        // Chaves estrangeiras
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public int PersonId { get; set; }
        public Person? Person { get; set; }

    }
