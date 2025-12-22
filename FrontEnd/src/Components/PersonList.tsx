import { useEffect, useState } from 'react';
import { AxiosError } from 'axios'; //  para tipar o erro
import { api } from '../Services/api';
import type { Person } from '../Types';

export function PersonList() {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchPeople() {
        try {
            const response = await api.get('/people');
            setPeople(response.data);
        } catch (error) {
            console.error("Erro ao buscar pessoas:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPeople();
    }, []);

    // --- Lógica de Deletar ---
    async function handleDelete(id: number, name: string) {
        if (!confirm(`Tem certeza que deseja excluir ${name}?`)) return;

        try {
            await api.delete(`/people/${id}`);
            // Remove da lista visualmente
            setPeople(prev => prev.filter(p => p.id !== id));
            alert("Pessoa removida!");
        } catch (error) {
            // Tratamento de erro tipado (Sem any)
            const err = error as AxiosError<{ message: string }>;
            const msg = err.response?.data?.message || "Erro desconhecido ao deletar.";
            alert(msg);
        }
    }

    const getInitials = (name: string) => name.charAt(0).toUpperCase();

    const getAvatarColor = (name: string) => {
        const colors = ['#3498db', '#e67e22', '#1abc9c', '#9b59b6', '#e74c3c', '#f1c40f'];
        const index = name.length % colors.length;
        return colors[index];
    };

    if (loading) return <p>Carregando contatos...</p>;

    return (
        <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#333', margin: 0 }}>Pessoas Cadastradas</h2>
                <span style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', color: '#555' }}>
                    {people.length} total
                </span>
            </div>
            
            {people.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    Nenhuma pessoa cadastrada.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                    {people.map((person) => (
                        <div key={person.id} style={{ 
                            backgroundColor: 'white', 
                            borderRadius: '12px', 
                            padding: '20px', 
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            border: '1px solid #f0f0f0',
                            transition: 'transform 0.2s',
                            position: 'relative' // <--- Necessário para o botão de deletar
                        }}>
                            {/* Botão de Excluir */}
                            <button 
                                onClick={() => handleDelete(person.id, person.name)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#ccc', // Cor discreta
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    lineHeight: 1
                                }}
                                title="Excluir pessoa"
                                onMouseOver={(e) => e.currentTarget.style.color = '#e74c3c'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}
                            >
                                ×
                            </button>

                            {/* Avatar com Inicial */}
                            <div style={{ 
                                width: '50px', 
                                height: '50px', 
                                borderRadius: '50%', 
                                backgroundColor: getAvatarColor(person.name), 
                                color: 'white',
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                flexShrink: 0
                            }}>
                                {getInitials(person.name)}
                            </div>

                            {/* Informações */}
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#333' }}>
                                    {person.name}
                                </h3>
                                <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                                    {person.age} anos
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
