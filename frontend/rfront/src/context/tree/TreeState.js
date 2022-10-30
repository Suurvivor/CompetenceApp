import React, { useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import TreeContext from './treeContext';
import treeReducer from './treeReducer';
import AlertContext from '../alert/alertContext';
import { errorHandler } from '../../utils/requestErrorHandler';
import {
   CLEAR_ERRORS,
   TREE_LOAD_DEPARTMENTS,
   TREE_LOAD_FAIL,
   TREE_LOAD_WORKPLACES,
   TREE_LOAD_COMPETENCES,
} from '../types';

// Create a custom hook to use the auth context

export const useTree = () => {
   const { state, dispatch } = useContext(TreeContext);
   return [state, dispatch];
};

export const getDepartments = async (dispatch) => {
   try {
      const res = await axios.get('/departments');
      dispatch({ type: TREE_LOAD_DEPARTMENTS, payload: res.data.data });
   } catch (error) {
      errorHandler(error, dispatch, TREE_LOAD_FAIL);
   }
};

export const getWorkplaces = async (dispatch, departmentId) => {
   try {
      const res = await axios.get(`/departments/${departmentId}/workplaces`);
      dispatch({ type: TREE_LOAD_WORKPLACES, payload: res.data.data });
   } catch (error) {
      errorHandler(error, dispatch, TREE_LOAD_FAIL);
   }
};

export const getCompetences = async (dispatch, workplaceId) => {
   console.log(`zalacza sie`);
   try {
      const res = await axios.get(`/workplaces/${workplaceId}/competences`);
      dispatch({ type: TREE_LOAD_COMPETENCES, payload: res.data.data });
   } catch (error) {
      errorHandler(error, dispatch, TREE_LOAD_FAIL);
   }
};

const TreeState = (props) => {
   const alertContext = useContext(AlertContext);
   const { setAlert } = alertContext;

   const initialState = {
      departments: null,
      workplaces: null,
      competences: null,
      error: null,
      loading: true,
   };

   const [state, dispatch] = useReducer(treeReducer, initialState);
   const { error } = state;

   useEffect(() => {
      if (error) {
         setAlert(error, 'danger');
         dispatch({ type: CLEAR_ERRORS });
      }
   }, [error]);

   return (
      <TreeContext.Provider value={{ state: state, dispatch }}>
         {props.children}
      </TreeContext.Provider>
   );
};

export default TreeState;
