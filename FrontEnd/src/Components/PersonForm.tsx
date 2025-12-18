// src/components/PersonForm.tsx
import { useState } from 'react';
import { api } from '../Services/api';
import  type { CreatePersonDto } from '../Types';

interface Props {
    onSuccess: () => void; // Uma função que o componente Pai vai passar
}

export function PersonForm({ onSuccess }: Props) {
    // Estados dos campos
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | ''>(''); // Começa vazio
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Evita que a página recarregue

        // Validação básica no Front
        if (!name || !age) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Monta o objeto para enviar (DTO)
            const payload: CreatePersonDto = {
                name: name,
                age: Number(age)
            };

            // Manda pro Backend (POST)
            await api.post('/people', payload);

            // Limpa os campos
            setName('');
            setAge('');
            alert("Pessoa cadastrada com sucesso!");

            // Avisa o componente Pai que deu certo
            onSuccess();

        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar pessoa.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Estilos simples para o formulário
    const formStyle = {
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const inputStyle = {
        padding: '8px',
        marginRight: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h3>Nova Pessoa</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                        placeholder="Ex: Maria Silva"
                    />
                </div>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Idade:</label>
                    <input 
                        type="number" 
                        value={age} 
                        onChange={(e) => setAge(Number(e.target.value))}
                        style={{ ...inputStyle, width: '80px' }}
                        placeholder="0"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    {isSubmitting ? 'Salvando...' : 'Cadastrar'}
                </button>
            </div>
        </form>
    );
}