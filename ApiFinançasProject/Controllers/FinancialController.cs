using ApiFinançasProject.Dtos;
using ApiFinançasProject.Models;
using ApiFinançasProject.Exceptions;
using ApiFinançasProject.Services;
using Microsoft.AspNetCore.Mvc;
namespace ApiFinançasProject.Controllers;
[ApiController]
[Route("api")]
public class FinancialController : ControllerBase
{
    private readonly IFinancialService _service;

    // Injeção de dependência da Interface do Serviço
    public FinancialController(IFinancialService service)
    {
        _service = service;
    }
    // ==========================================================
    // PESSOAS
    // ==========================================================
    /// <summary>
    /// Cadastra uma nova pessoa no sistema.
    /// </summary>
    /// <remarks>
    /// Exemplo de requisição:
    /// 
    ///     POST /people
    ///     {
    ///        "name": "Davi Siqueira",
    ///        "age": 24
    ///     }
    /// </remarks>
    /// <param name="person">Dados da pessoa a ser criada.</param>
    /// <returns>A pessoa criada com seu ID.</returns>
    /// <response code="201">Pessoa criada com sucesso.</response>
    /// <response code="400">Se os dados forem inválidos (ex: idade negativa).</response>
    [HttpPost("people")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreatePerson([FromBody] CreatePersonDto dto)
    {
        try
        {
            // Converte o DTO (Simples) para a Entidade (Completa)
            var person = new Person
            {
                Name = dto.Name,
                Age = dto.Age
            };

            var createdPerson = await _service.CreatePersonAsync(person);

            return CreatedAtAction(nameof(GetPeople), new { id = createdPerson.Id }, createdPerson);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Lista todas as pessoas cadastradas.
    /// </summary>
    /// <returns>Uma lista de pessoas.</returns>
    /// <response code="200">Sucesso.</response>
    [HttpGet("people")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPeople()
    {
        var people = await _service.GetPeopleAsync();
        return Ok(people);
    }

    /// <summary>
    /// Deleta uma pessoa e todas as suas transações (Cascade).
    /// </summary>
    /// <param name="id">ID da pessoa.</param>
    /// <response code="200">Pessoa deletada com sucesso.</response>
    /// <response code="404">Pessoa não encontrada.</response>
    [HttpDelete("people/{id}")]
    public async Task<IActionResult> DeletePerson(int id)
    {
        try
        {
            await _service.DeletePersonAsync(id);
            return Ok(new { message = "Pessoa deletada com sucesso!" });
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Pessoa não encontrada.");
        }
        catch (Exception ex)
        {
            return BadRequest($"Erro ao deletar: {ex.Message}");
        }
    }

    /// <summary>
    /// Deleta uma transação específica pelo ID.
    /// </summary>
    /// <param name="id">ID da transação.</param>
    /// <response code="200">Retorna mensagem de sucesso.</response>
    /// <response code="404">Se a transação não existir.</response>
    [HttpDelete("transactions/{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        try
        {
            await _service.DeleteTransactionAsync(id);
            return Ok(new { message = "Transação deletada com sucesso!" });
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Transação não encontrada.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    // ==========================================================
    // CATEGORIAS
    // ==========================================================
    
    /// <summary>
    /// Cadastra uma nova categoria de transação.
    /// </summary>
    /// <param name="category">Dados da categoria (Descrição e Escopo).</param>
    /// <returns>A categoria criada.</returns>
    /// <response code="201">Categoria criada com sucesso.</response>
    [HttpPost("categories")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateCategory(Category category)
    {
        try
        {
            var createdCategory = await _service.CreateCategoryAsync(category);
            return Ok(createdCategory);
        }
        catch (Exception ex)
        {
            return BadRequest($"Erro ao criar categoria: {ex.Message}");
        }
    }

    /// <summary>
    /// Lista todas as categorias disponíveis.
    /// </summary>
    /// <returns>Lista de categorias.</returns>
    /// <response code="200">Sucesso.</response>
    [HttpGet("categories")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _service.GetCategoriesAsync();
        return Ok(categories);
    }

    // ==========================================================
    // Transações
    // ==========================================================
    /// <summary>
    /// Cria uma nova transação financeira (Receita ou Despesa).
    /// </summary>
    /// <remarks>
    /// Regras aplicadas:
    /// - Menores de 18 anos não podem lançar Receitas.
    /// - Não é permitido lançar Despesa em categoria de Receita e vice-versa.
    /// </remarks>
    /// <param name="dto">DTO contendo os dados da transação.</param>
    /// <returns>A transação criada.</returns>
    /// <response code="201">Transação criada com sucesso.</response>
    /// <response code="400">Erro de validação ou regra de negócio.</response>
    /// <response code="404">Pessoa ou Categoria não encontrada.</response>
    [HttpPost("transactions")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateTransaction(CreateTransactionDto dto)
    {
        try
        {
            var result = await _service.CreateTransactionAsync(dto);
            return Ok(result);
        }
        catch (DomainException ex) // Erro de regra de negócio (Idade, Categoria)
        {
            // Retorna 400 Bad Request com a mensagem da regra violada
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex) // Erro de ID de pessoa ou categoria não encontrado
        {
            // Retorna 400 ou 404 dependendo da sua preferência. 
            // Como é um erro de entrada de dados (ID inválido), BadRequest é aceitável.
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }
    /// <summary>
    /// Lista todas as transações registradas.
    /// </summary>
    /// <returns>Lista de transações com dados da Pessoa e Categoria.</returns>
    /// <response code="200">Sucesso.</response>
    [HttpGet("transactions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTransactions()
    {
        var transactions = await _service.GetTransactionsAsync();
        return Ok(transactions);
    }
    /// <summary>
    /// Gera o relatório de totais por Categoria.
    /// </summary>
    /// <returns>Objeto contendo detalhes por categoria e total geral.</returns>
    /// <response code="200">Sucesso.</response>
    [HttpGet("reports/categories")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotalsByCategory()
    {
        try
        {
            var report = await _service.GetCategoryReportAsync();
            return Ok(report);
        }
        catch (Exception ex)
        {
            return BadRequest($"Erro ao gerar relatório: {ex.Message}");
        }
    }

    // ==========================================================
    // RELATÓRIOS
    // ==========================================================
    
    /// <summary>
    /// Gera o relatório de totais por Pessoa (Receitas, Despesas e Saldo).
    /// </summary>
    /// <returns>Objeto contendo detalhes por pessoa e total geral.</returns>
    /// <response code="200">Sucesso.</response>
    [HttpGet("reports/people")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotalsByPerson()
    {
        try
        {
            var report = await _service.GetPersonReportAsync();
            return Ok(report);
        }
        catch (Exception ex)
        {
            return BadRequest($"Erro ao gerar relatório: {ex.Message}");
        }
    }
}