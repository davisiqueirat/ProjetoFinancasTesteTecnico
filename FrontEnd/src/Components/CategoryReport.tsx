import { useEffect, useState, useMemo } from 'react';
import { api } from '../Services/api';
import type { Transaction, Person, Category } from '../Types'; 
/**
 * Componente: CategoryReport
 * Responsável por exibir um relatório financeiro consolidado por categorias.
 * * Funcionalidades:
 * - Listagem de receitas e despesas agrupadas por categoria.
 * - Filtragem dinâmica de lançamentos por Pessoa.
 * - Cálculo automático de saldos (por categoria e total geral).
 */

export function CategoryReport() {
    // --- Gerenciamento de Estado ---
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [people, setPeople] = useState<Person[]>([]); // <--- Estado para lista de pessoas
   
    // Controle do filtro de pessoa (vazio = todas)
    const [selectedPersonId, setSelectedPersonId] = useState(''); 
    const [loading, setLoading] = useState(true);


    /**
     * Carregamento inicial de dados.
     * Utiliza Promise.all para disparar as requisições em paralelo,
     * otimizando o tempo de carga e evitando "waterfall" de requests.
     */
    useEffect(() => {
        async function loadData() {
            try {
                // busca Pessoas também
                const [catResponse, transResponse, peopleResponse] = await Promise.all([
                    api.get('/categories'),
                    api.get('/transactions'),
                    api.get('/people')
                ]);
                setCategories(catResponse.data);
                setTransactions(transResponse.data);
                setPeople(peopleResponse.data);
            } catch (error) {
                console.error("Erro ao carregar relatório", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    /**
     * Lógica Principal de Processamento.
     * * 1. Filtra as transações baseadas na pessoa selecionada.
     * 2. Mapeia cada categoria existente.
     * 3. Agrega os valores (reduce) calculando Receita, Despesa e Saldo por categoria.
     * * Memoizado para evitar recálculos pesados em re-renderizações simples.
     */    const reportData = useMemo(() => {
            // Passo 1: Filtragem prévia
            const filteredTransactions = selectedPersonId
            ? transactions.filter(t => t.personId === Number(selectedPersonId))
            : transactions;

        // Passo 2 e 3: Agrupamento e Cálculo
        const summary = categories.map(cat => {
            // Pega só as transações dessa categoria (dentro das já filtradas por pessoa)
            const catTransactions = filteredTransactions.filter(t => t.categoryId === cat.id);

            // Soma condicional baseada no tipo da transação ('Income' ou 'Expense')
            const income = catTransactions
                .filter(t => t.type === 'Income')
                .reduce((acc, t) => acc + t.value, 0);

            const expense = catTransactions
                .filter(t => t.type === 'Expense')
                .reduce((acc, t) => acc + t.value, 0);

            return {
                id: cat.id,
                name: cat.description,
                income,
                expense,
                balance: income - expense
            };
        });

        return summary;
    }, [categories, transactions, selectedPersonId]); // Recalcula se mudar a pessoa

    /**
     * Cálculo do Totalizador Geral (Rodapé da Tabela).
     * Soma os resultados já processados em 'reportData'.
     */
    const grandTotal = useMemo(() => {
        return reportData.reduce((acc, item) => ({
            income: acc.income + item.income,
            expense: acc.expense + item.expense,
            balance: acc.balance + item.balance
        }), { income: 0, expense: 0, balance: 0 });
    }, [reportData]);

    const format = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    if (loading) return <p>Calculando relatório...</p>;

    return (
        <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#333', margin: 0 }}>Categoria</h2>
                
                {/* O Filtro de Pessoa Agora Está Aqui */}
                <select 
                    className="custom-select"
                    value={selectedPersonId}
                    onChange={(e) => setSelectedPersonId(e.target.value)}
                    style={{ backgroundColor: 'white' }}
                >
                    <option value="">Todos (Geral)</option>
                    {people.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>
            {/* Tabela de Dados */}
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
                    <tr>
                        <th style={{ padding: '12px' }}>Categoria</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Receitas</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Despesas</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Saldo Líquido</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px', fontWeight: '500' }}>{item.name}</td>
                            {/* Coluna Receitas (Verde) */}
                            <td style={{ padding: '12px', textAlign: 'right', color: '#2ecc71' }}>
                                {item.income > 0 ? format(item.income) : '-'}
                            </td>
                            {/* Coluna Despesas (Vermelho) */}
                            <td style={{ padding: '12px', textAlign: 'right', color: '#e74c3c' }}>
                                {item.expense > 0 ? format(item.expense) : '-'}
                            </td>
                            {/* Coluna Saldo (Cor dinâmica baseada no valor) */}
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: item.balance >= 0 ? '#2c3e50' : '#c0392b' }}>
                                {format(item.balance)}
                            </td>
                        </tr>
                    ))}
                    
                    {/* Linha de Total Geral */}
                    <tr style={{ backgroundColor: '#f0f0f0', borderTop: '2px solid #ccc', fontWeight: 'bold' }}>
                        <td style={{ padding: '12px' }}>TOTAL DO PERÍODO</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#27ae60' }}>{format(grandTotal.income)}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#c0392b' }}>{format(grandTotal.expense)}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#2c3e50' }}>{format(grandTotal.balance)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default CategoryReport
