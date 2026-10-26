import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/storage';

function withAuth(Component){
    return function ProtectedComponent(props) {
        if (!isLoggedIn()) {
            return <Navigate to ='/login' replace />;
        } 
        return <Component {...props} />;
    };
}

export default withAuth;