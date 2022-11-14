import React, { useState, useContext, useEffect } from 'react';
import {
   useTree,
   getWorkplaces,
   createDepartment,
   deleteDepartment,
   setCurrentDepartment,
} from '../../context/tree/TreeState';
import Spinner from '../layout/Spinner';

const DepartmentList = () => {
   const [treeState, treeDispatch] = useTree();
   const [showAdd, setShowAdd] = useState(false);
   const [departmentName, setDepartmentName] = useState(null);

   const onCreate = () => {
      createDepartment(treeDispatch, departmentName);
      setShowAdd(false);
      setDepartmentName(null);
   };

   const onPick = (departId) => {
      getWorkplaces(treeDispatch, departId);
      setCurrentDepartment(treeDispatch, departId);
   };

   if (treeState.loading) return <Spinner />;
   return (
      <>
         <div className='treeWrapper'>
            <div id='treeDepartments'>
               <ul className='treeUlDepartments'>
                  {treeState.departments.map((department, index) => (
                     <div className='tree_dashboard_ul_item' key={department._id}>
                        <li key={department._id} id={department._id} onClick={(e) => onPick(e.target.id)}>
                           {department.name}
                        </li>
                        <i
                           className='fa-solid fa-circle-minus tree_delete_icon'
                           onClick={() => deleteDepartment(treeDispatch, department._id)}
                        ></i>
                     </div>
                  ))}
               </ul>
               {showAdd && (
                  <>
                     <div className='tree_dashboard_ul_item tree_dashboard_ul_item_new'>
                        <input
                           type='text'
                           placeholder='Podaj nazwe działu'
                           className='tree_dashboard_ul_item_input'
                           onChange={(e) => setDepartmentName(e.target.value)}
                        />

                        <i className='fa-solid fa-xmark tree_delete_icon' onClick={() => setShowAdd(false)}></i>
                     </div>
                     <button className='tree_dashboard_ul_button' onClick={onCreate}>
                        Stwórz
                     </button>
                  </>
               )}
               {showAdd === false && (
                  <button onClick={() => setShowAdd(true)} className='tree_dashboard_ul_button'>
                     Stworz nowy dział
                  </button>
               )}
            </div>
         </div>
      </>
   );
};

export default DepartmentList;
