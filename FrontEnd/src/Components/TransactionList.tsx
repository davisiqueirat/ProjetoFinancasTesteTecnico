import { useEffect, useState, useMemo } from 'react';
import { api } from '../Services/api';
// Importe o TransactionType (opcional, mas bom para tipagem)
import type { Transaction, Person, Category } from '../Types'; 

export function TransactionList() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [people, setPeople] = useState<Person[]>([]); 
    const [categories, setCategories] = useState<Category[]>([]);

    const [selectedPersonId, setSelectedPersonId] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [loading, setLoading] = useState(true);

    async function loadData() {
        try {
            const [transResponse, peopleResponse, catResponse] = await Promise.all([
                api.get('/transactions'),
                api.get('/people'),
                api.get('/categories')
            ]);
            setTransactions(transResponse.data);
            setPeople(peopleResponse.data);
            setCategories(catResponse.data);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleDeleteTransaction(id: number) {
        if (!confirm("Deseja realmente apagar este lançamento?")) return;

        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir transação.");
        }
    }

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesPerson = selectedPersonId ? t.personId === Number(selectedPersonId) : true;
            const matchesCategory = selectedCategoryId ? t.categoryId === Number(selectedCategoryId) : true;
            return matchesPerson && matchesCategory;
        });
    }, [selectedPersonId, selectedCategoryId, transactions]);

    function formatCurrency(value: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    if (loading) return <p>Carregando extrato...</p>;

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ color: '#333', margin: 0 }}>Extrato de Lançamentos</h2>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                        className="custom-select"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        style={{ backgroundColor: 'white' }}
                    >
                        <option value="">Todas Categorias</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.description}</option>
                        ))}
                    </select>

                    <select 
                        className="custom-select"
                        value={selectedPersonId}
                        onChange={(e) => setSelectedPersonId(e.target.value)}
                        style={{ backgroundColor: 'white' }}
                    >
                        <option value="">Todas Pessoas</option>
                        {people.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            {filteredTransactions.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Nenhuma transação encontrada.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                        <tr>
                            <th style={{ padding: '12px' }}>Descrição</th>
                            <th style={{ padding: '12px' }}>Quem?</th>
                            <th style={{ padding: '12px' }}>Categoria</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Valor</th>
                            <th style={{ padding: '12px', width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((t) => {
                            // CORREÇÃO CRUCIAL AQUI:
                            // Verificamos se é 'Expense' (Inglês)
                            const isExpense = t.type === 'Expense';

                            return (
                                <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{t.description}</td>
                                    <td style={{ padding: '12px' }}>{t.person?.name || 'N/A'}</td>
                                    <td style={{ padding: '12px' }}>{t.category?.description || '-'}</td>
                                    
                                    <td style={{ 
                                        padding: '12px', 
                                        textAlign: 'right', 
                                        fontWeight: 'bold',
                                        // Usa a variável booleana para decidir a cor
                                        color: isExpense ? '#e74c3c' : '#2ecc71' 
                                    }}>
                                        {/* Usa a variável booleana para decidir o sinal */}
                                        {isExpense ? '- ' : '+ '}
                                        {formatCurrency(t.value)}
                                    </td>

                                    <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <button 
                                            onClick={() => handleDeleteTransaction(t.id)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                color: '#e74c3c',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                fontSize: '1.5rem',
                                                lineHeight: '1',
                                                padding: '0 5px'
                                            }}
                                            title="Excluir"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default TransactionList