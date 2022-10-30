import {
   CLEAR_ERRORS,
   NETWORK_ERROR,
   TREE_LOAD_FAIL,
   TREE_LOAD_DEPARTMENTS,
   TREE_LOAD_WORKPLACES,
   TREE_LOAD_COMPETENCES,
} from '../types';

const treeReducer = (state, action) => {
   switch (action.type) {
      case TREE_LOAD_DEPARTMENTS:
         return {
            ...state,
            departments: action.payload,
            loading: false,
         };
      case TREE_LOAD_WORKPLACES:
         return {
            ...state,
            workplaces: action.payload,
            loading: false,
         };
      case TREE_LOAD_COMPETENCES:
         return {
            ...state,
            competences: action.payload,
            loading: false,
         };
      case NETWORK_ERROR:
      case TREE_LOAD_FAIL:
         return {
            ...state,
            error: action.payload,
            loading: false,
         };
      case CLEAR_ERRORS:
         return {
            ...state,
            error: null,
            loading: false,
         };
      default:
         throw new Error(`Unsupported type of: ${action.type}`);
   }
};

export default treeReducer;
