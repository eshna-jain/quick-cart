import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export const SearchBar = () => {
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();

        if(input.trim()) {
            navigate(`/products?search=${encodeURIComponent(input.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className='flex justify-space px-6 py-6'>
            <div className='flex w-full max-w-2xl h-10'>
                <input type='text' placeholder='Search products...' value={input}
                onChange={(e) => setInput(e.target.value)}
                className='w-full px-4 text-sm  bg-white border border-gray-300 rounded-l-lg
                outline-none' />

                <button onClick={handleSearch} className='px-5 bg-blue-600 text-sm
                text-white rounded-r-lg hover:bg-blue-700'> 
                🔍︎ </button>
            </div>
        </form>
    );
};

export default SearchBar;