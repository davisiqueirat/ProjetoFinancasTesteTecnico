using System.ComponentModel.DataAnnotations;
namespace ApiFinançasProject.Dtos;
public class CreatePersonDto
{
    [Required(ErrorMessage = "O nome é obrigatório")]
    public string Name { get; set; }

    [Range(0, 120, ErrorMessage = "A idade deve ser entre 0 e 120 anos")]
    public int Age { get; set; }
}