import React, { useEffect } from 'react';
import { useAuth } from '../../context/auth/AuthState';
import { useTree, getDepartments } from '../../context/tree/TreeState';
import DepartmentList from './DepartmentList';
import Spinner from '../layout/Spinner';

export const Tree = () => {
   const [authState] = useAuth();
   const [treeState, treeDispatch] = useTree();
   const { departments, loading } = treeState;
   useEffect(() => {
      //getDepartments
      getDepartments(treeDispatch);
   }, []);

   if (loading || !departments) return <Spinner />;
   return (
      <>
         <DepartmentList />
      </>
   );
};