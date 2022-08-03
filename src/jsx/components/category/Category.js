import React, { useEffect, useState, useRef } from 'react'
import { connect } from "react-redux";
import { getCategory, deleteCategory } from '../../../stores/category/actions';

const Category = (props) => {
    //useState() = 
    const [addForm, setAddForm] = useState(false);
    useEffect(() => {
        //call api or anything
        console.log("loaded");
        getCategory();
        
     }, []);
     const getCategory = async () =>{
        await props.getCategory();
     }
     const handelDelete = async (id) => {
        await props.deleteCategory(id);
     }

     const handelAdd = async () => {
        setAddForm(true);
     }
    return(
        <div>
            { addForm 
            ? (
                (
                    <div>
                        <div className='row'>
                            <button className='btn btn-primary' onClick={() => handelAdd()}>
                                Add Category
                            </button>
                        </div>
                        <div className='page-titles d-flex  align-items-center row'>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Data</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.categories.map(item=>(
                                        <tr>
                                            <td>{item.id}</td>
                                            <td>{item.id}</td>
                                            <td>
                                                <button className='btn btn-success' onClick={() => handelDelete(item.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
                
            ) 
            : 
                <div>
                    
                    fsf sdf s
                </div>
            }
        </div>
        
    )
}
const mapStateToProps = (state) => ({
    categories: state.categories.categories,
});
const mapDispatchToProps = {
    getCategory,
    deleteCategory
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);