import { Link } from 'react-router-dom';

export function Header() {
    const headerStyle = {
        backgroundColor: '#2c3e50', 
        padding: '15px 0',
        marginBottom: '30px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    };

    const containerStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    const logoStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    const navLinkStyle = {
        color: '#ecf0f1',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        transition: 'color 0.2s'
    };

    return (
        <header style={headerStyle}>
            <div style={containerStyle}>
                
                <Link to="/" style={logoStyle}>
                    FinançasApp
                </Link>

                <nav style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/" style={navLinkStyle}>Dashboard</Link>
                    <Link to="/pessoas" style={navLinkStyle}>Pessoas</Link>
                    <Link to="/transacoes" style={navLinkStyle}>Transações</Link>
                </nav>
            </div>
        </header>
    );
}
