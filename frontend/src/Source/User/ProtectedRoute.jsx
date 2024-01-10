import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      element={
        authenticated ? (
          <Element />
        ) : (
          <Navigate to="/" replace state={{ from: rest.location }} />
        )
      }
    />
  );
};

export default ProtectedRoute;
