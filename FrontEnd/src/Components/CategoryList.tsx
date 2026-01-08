import { useEffect, useState } from 'react';
import { api } from '../Services/api';
import type { Category, CategoryScope } from '../Types';

export function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        api.get<Category[]>('/categories')
            .then(response => setCategories(response.data))
            .catch(err => console.error("Erro ao carregar", err));
    }, []); 

    // --- ESTILOS ---
    const thStyle: React.CSSProperties = {
        padding: '16px',
        borderBottom: '2px solid #e5e7eb',
        textAlign: 'left',
        fontWeight: '600',
        color: '#4b5563',
        backgroundColor: '#f9fafb'
    };

    const tdStyle: React.CSSProperties = {
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        color: '#374151',
        verticalAlign: 'middle' 
    };

    function getBadgeStyle(scope: CategoryScope): React.CSSProperties {
        const baseStyle: React.CSSProperties = {
            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block'
        };
        if (scope === 'Income') return { ...baseStyle, backgroundColor: '#dcfce7', color: '#15803d' };
        if (scope === 'Expense') return { ...baseStyle, backgroundColor: '#fee2e2', color: '#b91c1c' };
        return { ...baseStyle, backgroundColor: '#dbeafe', color: '#1d4ed8' };
    }

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden', marginTop: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th style={{ ...thStyle, width: '75%' }}>Descrição</th>
                        <th style={{ ...thStyle, width: '25%' }}>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id}>
                            <td style={{ ...tdStyle, fontWeight: '500' }}>{cat.description}</td>
                            
                            <td style={tdStyle}>
                                <span style={getBadgeStyle(cat.scope)}>
                                    {cat.scope === 'Income' ? 'Receita' : cat.scope === 'Expense' ? 'Despesa' : 'Ambos'}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={2} style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>
                                Nenhuma categoria encontrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
