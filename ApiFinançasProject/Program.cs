using ApiFinançasProject.Data;
using ApiFinançasProject.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

// --- SERVIÇOS ---

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    }); 
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Controle de Gastos API",
        Description = "API desenvolvida para teste técnico usando .NET 8 e React."
    });
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// --- INJEÇÃO DE DEPENDÊNCIA ---
builder.Services.AddScoped<IFinancialService, FinancialService>();

// --- CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        b => b.WithOrigins("http://localhost:5173") // Porta padrão do Vite
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// --- PIPELINE DE EXECUÇÃO ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");

app.UseAuthorization();

app.MapControllers();

app.Run();