// src/components/SummaryCards.tsx
import { useEffect, useState, useMemo } from 'react'; // <--- Adicione useMemo
import { api } from '../Services/api';
import type { Transaction, Person } from '../Types';

export function SummaryCards() {
    // Dados brutos (Isso sim é Estado)
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState('');

    // Carrega dados iniciais
    useEffect(() => {
        async function loadData() {
            try {
                const [transResponse, peopleResponse] = await Promise.all([
                    api.get('/transactions'),
                    api.get('/people')
                ]);
                setAllTransactions(transResponse.data);
                setPeople(peopleResponse.data);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        loadData();
    }, []);

    // A MÁGICA DO USEMEMO (Substitui o useEffect problemático)
    // O React memoriza o resultado e só recalcula se 'allTransactions' ou 'selectedPersonId' mudarem.
    const totals = useMemo(() => {
        // 1. Filtra
        const filteredList = selectedPersonId 
            ? allTransactions.filter(t => t.personId === Number(selectedPersonId))
            : allTransactions;

        // 2. Calcula Entradas
        const income = filteredList
            .filter(t => t.type === 'Income')
            .reduce((acc, t) => acc + t.value, 0);

        // 3. Calcula Saídas
        const expense = filteredList
            .filter(t => t.type === 'Expense')
            .reduce((acc, t) => acc + t.value, 0);

        // 4. Retorna tudo num objeto
        return {
            income,
            expense,
            balance: income - expense
        };
    }, [selectedPersonId, allTransactions]); // <--- Só roda se isso mudar

    const format = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const cardStyle = {
        flex: 1,
        minWidth: '200px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        textAlign: 'center' as const
    };

    return (
        <div>
            {/* Filtro Bonito com classes CSS */}
            <div style={{ marginBottom: '20px' }}>
                <div className="filter-container" style={{ display: 'inline-flex' }}>
                    <label className="filter-label">Filtrar Resumo:</label>
                    <select 
                        className="custom-select"
                        value={selectedPersonId} 
                        onChange={(e) => setSelectedPersonId(e.target.value)}
                    >
                        <option value="">Todos (Visão Geral)</option>
                        {people.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Cards usando os valores calculados no useMemo (totals.xxx) */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                <div style={cardStyle}>
                    <h3 style={{ margin: 0, color: '#666', fontSize: '1rem' }}>Entradas</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71', margin: '10px 0' }}>
                        {format(totals.income)}
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3 style={{ margin: 0, color: '#666', fontSize: '1rem' }}>Saídas</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c', margin: '10px 0' }}>
                        {format(totals.expense)}
                    </p>
                </div>

                <div style={{ ...cardStyle, backgroundColor: '#2c3e50', color: 'white' }}>
                    <h3 style={{ margin: 0, color: '#bdc3c7', fontSize: '1rem' }}>Saldo Total</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {format(totals.balance)}
                    </p>
                </div>
            </div>
        </div>
    );
}
export default SummaryCards