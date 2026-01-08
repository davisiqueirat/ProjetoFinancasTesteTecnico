import { useState } from 'react';
import { api } from '../Services/api';
import type { CategoryScope } from '../Types';

interface Props {
    onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: Props) {
    const [description, setDescription] = useState('');
    const [scope, setScope] = useState<CategoryScope>('Expense');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if (!description) {
            alert("Preencha a descrição!");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.post('/categories', { description, scope });
            
            setDescription('');
            setScope('Expense'); 
            
            alert("Categoria criada com sucesso!");
            onSuccess(); 
            
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert('Erro ao salvar categoria.');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Estilos para os inputs
    const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' };

    return (
        <form 
            onSubmit={handleSubmit} 
            style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}
        >
            <h3 style={{ marginTop: 0, color: '#333' }}>Nova Categoria</h3>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        style={inputStyle} 
                        placeholder="Ex: Mercado, Lazer, Salário..."
                        required 
                    />
                </div>

                {/* O Tipo tem tamanho fixo menor */}
                <div style={{ width: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo</label>
                    <select 
                        value={scope} 
                        onChange={e => setScope(e.target.value as CategoryScope)} 
                        style={inputStyle}
                    >
                        <option value="Expense">Despesa</option>
                        <option value="Income">Receita</option>
                    </select>
                </div>

                <div style={{ width: '150px' }}>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        style={{ 
                            width: '100%', 
                            padding: '9px', 
                            backgroundColor: isSubmitting ? '#95a5a6' : '#2c3e50',
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                            fontWeight: 'bold',
                        }}
                    >
                        {isSubmitting ? '...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </form>
    );
}