import { useEffect, useState, useMemo } from 'react';
import { api } from '../Services/api';
import { SummaryCards } from '../Components/SummaryCards';
import { TransactionList } from '../Components/TransactionList';
import type { Transaction, Person } from '../Types';

export function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState('');
    const [loading, setLoading] = useState(true);

    // Busca os dados uma vez só
    useEffect(() => {
        async function loadData() {
            try {
                const [transResponse, peopleResponse] = await Promise.all([
                    api.get('/transactions'),
                    api.get('/people')
                ]);
                setTransactions(transResponse.data);
                setPeople(peopleResponse.data);
            } catch (error) {
                console.error("Erro ao carregar dashboard", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Filtra para os CARDS
    const filteredTransactions = useMemo(() => {
        if (!selectedPersonId) return transactions;
        return transactions.filter(t => t.personId === Number(selectedPersonId));
    }, [transactions, selectedPersonId]);

    if (loading) return <p>Carregando...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#333', margin: 0 }}>Dashboard Financeiro</h2>
                
                {/* Apenas UM filtro aqui no topo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontWeight: 'bold' }}>Filtrar Resumo por:</label>
                    <select 
                        value={selectedPersonId}
                        onChange={(e) => setSelectedPersonId(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Geral (Todos)</option>
                        {people.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Passa a lista filtrada para os Cards somarem */}
            <SummaryCards transactions={filteredTransactions} />

            <div style={{ marginTop: '40px' }}>
                <TransactionList />
            </div>
        </div>
    );
}