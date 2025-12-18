using ApiFinançasProject.Models;
namespace ApiFinançasProject.Dtos;

public record CreateTransactionDto(
  string Description,
  decimal Value,
  TransactionType Type,
  int CategoryId,
  int PersonId
);
