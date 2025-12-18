using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace ApiFinançasProject.Models;

    public class Person
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        
        public required string Name { get; set; }
        
        [Range(0, 120, ErrorMessage = "A idade deve ser um número positivo.")]
        public int Age { get; set; }

    // Propriedade de navegação para o EF Core
    // Permite acessar as transações dessa pessoa facilmente
    [JsonIgnore]
    public List<Transaction> Transactions { get; set; } = new();
    }