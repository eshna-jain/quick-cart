import {useNavigate} from 'react-router-dom';

function CategoryCard({category}) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/products?search=${encodeURIComponent(category.name)}`);
    };

    return (
        <div className='bg-white rounded-lx p-6 
        shadow-sm hover:shadow-md cursor-pointer'>
            <button type="button" onClick={handleClick} className='w-full cursor-pointer'>
            <h3 className='text-lg font-semibold text-center'>
                {category.name} </h3>
            </button>
        </div>
    );

};

export default CategoryCard;