import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import   { Roles }  from '../models/rol';
import { AppStore } from '../redux/store';

interface Props {
  rol: Roles;
}

function RoleGuard({ rol }: Props) {
  const userState = useSelector((store: AppStore) => store.user);
  return userState.role === rol ? <Outlet/> : <Navigate replace to={'not-autorized'} />;
}
export default RoleGuard;
