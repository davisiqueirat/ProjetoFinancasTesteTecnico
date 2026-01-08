import { useEffect, useState } from 'react';
import { api } from '../Services/api';
import { SummaryCards } from '../Components/SummaryCards';
import { TransactionList } from '../Components/TransactionList';
import type { Transaction } from '../Types';

export function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Busca apenas as transações
    useEffect(() => {
        async function loadData() {
            try {
                const response = await api.get('/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error("Erro ao carregar dashboard", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <p>Carregando...</p>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#333', margin: 0 }}>Dashboard Financeiro</h2>
            </div>

            <SummaryCards transactions={transactions} />

            <div style={{ marginTop: '40px' }}>
                {/* A lista de transações) */}
                <TransactionList />
            </div>
        </div>
    );
}
