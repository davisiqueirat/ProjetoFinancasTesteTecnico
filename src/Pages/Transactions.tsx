import { useState } from 'react';
import { TransactionList } from "../Components/TransactionList";
import { TransactionForm } from "../Components/TransactionForm";

export function Transactions() {
    const [updateKey, setUpdateKey] = useState(0);

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ color: '#333' }}>Gestão de Transações</h1>
            
            {/* Formulário de Cadastro */}
            <TransactionForm onSuccess={() => setUpdateKey(prev => prev + 1)} />

            <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ddd' }} />

            {/* Lista de Transações (Recarrega quando updateKey muda) */}
            <TransactionList key={updateKey} />
        </div>
    );
}