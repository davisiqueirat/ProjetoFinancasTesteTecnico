import { useState } from 'react';
import { CategoryList } from "../Components/CategoryList";
import { CategoryForm } from "../Components/CategoryForm";

export function Categories() {
    // Estado para forçar a atualização da lista 
    const [updateKey, setUpdateKey] = useState(0);

    function handleCategoryAdded() {
        setUpdateKey(prev => prev + 1);
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestão de Categorias</h1>
            
            {/* O Formulário recebe a função de sucesso */}
            <CategoryForm onSuccess={handleCategoryAdded} />
            
            <hr className="my-6 border-gray-200" />

            {/* A Lista recebe a key. Se a key mudar, a lista recarrega sozinha */}
            <CategoryList key={updateKey} />
        </div>
    );
}
