import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { api } from '../Services/api';
import type { Person, Category, CreateTransactionDto, TransactionType } from '../Types';

interface Props {
    onSuccess: () => void;
}

export function TransactionForm({ onSuccess }: Props) {
    // Listas para os Selects
    const [peopleList, setPeopleList] = useState<Person[]>([]);
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);

    // Estados do Formulário
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    
    // ESTADO DO TIPO: 
    const [type, setType] = useState<TransactionType>('Expense');
    
    const [personId, setPersonId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    //  Carregar dados ao abrir
    useEffect(() => {
        async function loadData() {
            try {
                const [peopleResponse, categoriesResponse] = await Promise.all([
                    api.get('/people'),
                    api.get('/categories')
                ]);
                setPeopleList(peopleResponse.data);
                setCategoriesList(categoriesResponse.data);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
                alert("Erro: Não foi possível carregar as listas.");
            }
        }
        loadData();
    }, []);

    // Enviar Formulário
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!description || !value || !personId || !categoryId) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            setIsSubmitting(true);

            // Montando o objeto para enviar (Payload)
            const payload: CreateTransactionDto = {
                description,
                value: Number(value), 
                type: type,           
                personId: Number(personId),
                categoryId: Number(categoryId)
            };

            await api.post('/transactions', payload);
            
            // Limpar formulário após sucesso
            setDescription('');
            setValue('');
            setType('Expense'); // Reseta para Despesa
            setPersonId('');
            setCategoryId(''); // Opcional: limpar categoria também
            
            alert("Transação lançada com sucesso!");
            onSuccess(); // Atualiza a lista pai

        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            console.error(err);

            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Erro desconhecido ao lançar transação.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    // Estilos simples
    const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' };
    const groupStyle = { marginBottom: '10px', flex: 1 };

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Nova Transação</h3>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {/* Descrição */}
                <div style={groupStyle}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        style={inputStyle} 
                        placeholder="Ex: Conta de Luz" 
                    />
                </div>

                {/* Valor */}
                <div style={{ ...groupStyle, maxWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Valor (R$)</label>
                    <input 
                        type="number" 
                        value={value} 
                        onChange={e => setValue(e.target.value)} 
                        style={inputStyle} 
                        placeholder="0.00" 
                    />
                </div>

                {/* Tipo (Select de String) */}
                <div style={{ ...groupStyle, maxWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo</label>
                    <select 
                        value={type} 
                        onChange={e => setType(e.target.value as TransactionType)} // Sem conversão para Number!
                        style={inputStyle}
                    >
                        <option value="Expense">Despesa</option>
                        <option value="Income">Receita</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {/* Pessoa */}
                <div style={groupStyle}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quem?</label>
                    <select value={personId} onChange={e => setPersonId(e.target.value)} style={inputStyle}>
                        <option value="">Selecione...</option>
                        {peopleList.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Categoria */}
                <div style={groupStyle}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoria</label>
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={inputStyle}>
                        <option value="">Selecione...</option>
                        {categoriesList.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.description}
                                {/* Mostra o escopo apenas para ajudar visualmente */}
                                {c.scope === 'Income' ? ' (Receita)' : c.scope === 'Expense' ? ' (Despesa)' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting} 
                style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: isSubmitting ? '#95a5a6' : '#2c3e50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                    marginTop: '10px',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                }}
            >
                {isSubmitting ? 'Salvando...' : 'Lançar Transação'}
            </button>
        </form>
    );
}