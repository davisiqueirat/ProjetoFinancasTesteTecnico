import { useState } from 'react';
import { PersonList } from "../Components/PersonList";
import { PersonForm } from "../Components/PersonForm";

export function People() {
    // Estado para forçar a atualização da lista
    const [updateKey, setUpdateKey] = useState(0);

    // Função chamada quando o formulário termina de salvar
    function handlePersonAdded() {
        setUpdateKey(prev => prev + 1); // Muda o número (0 -> 1 -> 2...)
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#333' }}>Gestão de Pessoas</h1>
            
            {/* O Formulário */}
            <PersonForm onSuccess={handlePersonAdded} />
            
            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ddd' }} />

            {/*  Lista */}
            {/* A prop 'key' se mudar, a lista recarrega */}
            <PersonList key={updateKey} />
        </div>
    );
}