import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

import './Todolist.css';
import pic from '../Assets/prof7.png';
function Home() {
    const [auth, setAuth] = useState(false)
    const [name, setName] = useState('')
    const [userID, setUserID] = useState('')
    const [message, setMessage] = useState('')
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editTaskData, setEditTaskData] = useState(null);
    const [data,setData] =useState([])
    // const [userID, setUserID] = useState(null);
    const [values, setValues] = useState({
        task: '',
        description: '',
        date:'',
        time:'',
    })
    const handleChange=(event)=>{
        setValues({...values, [event.target.name]:[event.target.value]});
    }
    const toggleForm = () => {
        setShowForm(!showForm);
    };
    const toggleEditForm = () => {
        setShowEditForm(!showEditForm);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { ...values, userID }; // Include name in form data
        axios.post('http://localhost:8081/list', formData)
            .then(res => {
                console.log("added");
                setData([...data, { ...formData, ID: res.data.insertId }]); // Update state with new data
                setShowForm(false);
            })
            .catch(err => {
                console.log(err);
            });
    };
    useEffect(() => {
        axios.get('http://localhost:8081/list', { params: { userID: userID } })
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    }, [userID]);
    useEffect(() => {
        axios.get('http://localhost:8081', { withCredentials: true })
            .then(res => {
                console.log(res.data);
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setName(res.data.name);
                    setUserID(res.data.userID);
                } else {
                    setAuth(false);
                    setMessage(res.data.Message);
                }
            })
            .catch(err => {
                console.error('Error fetching authentication status:', err);
                setAuth(false);
                setName('');
                setMessage('Failed to fetch authentication status');
            });
    }, []);
    const handleDelete = (id) => {
        axios.delete('http://localhost:8081/delete/' + id)
            .then(() => {
                setData(data.filter(item => item.ID !== id));
                
            })
            .catch(err => console.log(err));
    }
    const handleEdit = (list) => {
        setValues({
            task: list.task,
            description: list.description,
            time: list.time,
            date: list.date
        });
        setEditTaskData(list);
        toggleEditForm();
    };
    const handleUpdate = () => {
        axios.put(`http://localhost:8081/update/${editTaskData.ID}`, values, {
        headers: {
            'Content-Type': 'application/json' // Set Content-Type header
        }
        })
            .then(res => {
                console.log("Task updated");
                setShowEditForm(false);
                window.location.reload(); // Refresh after updating task
            })
            .catch(err => {
                console.log(err);
            });
    };
    const handleComplete = (id, list) => {
        if (!list || typeof list !== 'object' || !list.hasOwnProperty('complete')) {
            console.error('Invalid list object:', list);
            return;
        }
    
        // Calculate the new completion status
        const newCompletionStatus = list.complete === 'completed' ? 'not completed' : 'completed';
    
        // Send the request to update the completion status
        axios.put(`http://localhost:8081/updateComplete/${id}`, { complete: newCompletionStatus })
            .then(res => {
                console.log("Task completion status updated");
    
                // Update the task's completion status locally without mutating the original data
                const updatedData = data.map(item => {
                    // Check if this is the task being updated
                    if (item.ID === id) {
                        // Return a new object with updated completion status
                        return { ...item, complete: newCompletionStatus };
                    }
                    // For other tasks, return them as they are
                    return item;
                });
    
                // Update the state with the new data
                setData(updatedData);
            })
            .catch(err => {
                console.error("Error updating completion status:", err);
            });
    };
    
    
    
    useEffect(() => {
        // Function to check tasks and alert if due
        const checkTasks = () => {
            data.forEach(task => {
                const currentDate = new Date();
                const taskDate = new Date(task.date + 'T' + task.time);

                if (currentDate >= taskDate && task.complete !== 'completed') {
                    alert(`Task "${task.task}" is due!`);
                }
            });
        };

        // Check tasks initially
        checkTasks();

        // Check tasks periodically every minute
        const interval = setInterval(checkTasks, 60000);

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [data]);
  return (
    <div className='wrapp'>
        {
            auth ?
            <div className='conti'>
                <div className="bar">
                    <div className="head_prof">
                        <img src={pic} alt='' className='profle-image'/>
                        <h3>{name}</h3>
                    </div>
                </div>
                <div className='header'>
                    <h2 className='head'>Todo List</h2>
                    <button className='btn btn-primary m-2' onClick={toggleForm}> Create task</button>
                </div>
                {showForm && (
                    <div className="popup">
                        <div className="form_head">
                            <h1>Create task</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input">
                                <div className="box">
                                    <h2>Task</h2>
                                    <input placeholder='Enter Task: ' name='task' onChange={handleChange} />
                                </div>
                                <div className="box2">
                                    <h2>Describe</h2>
                                    <textarea placeholder='Enter details: ' name='description' onChange={handleChange} />
                                </div>
                                <div className="date_time">
                                    <div className="box2">
                                        <h2>Date</h2>
                                        <input type='date' placeholder='date ' name='date' onChange={handleChange} />
                                    </div>
                                    <div className="box2">
                                        <h2>time</h2>
                                        <input type='time' placeholder='Time ' name='time' onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="btn1">
                                <button type='submit'>Add</button>
                            </div>
                        </form>
                    </div>
                )}
                {showEditForm && (
                    <div className="popup">
                        <div className="form_head">
                            <h1>Edit task</h1>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="input">
                                <div className="box">
                                    <h2>Task</h2>
                                    <input placeholder='Enter Task: ' name='task' value={values.task} onChange={handleChange} />
                                </div>
                                <div className="box2">
                                    <h2>Describe</h2>
                                    <textarea placeholder='Enter details: ' name='description' value={values.description} onChange={handleChange} />
                                </div>
                                <div className="date_time">
                                    <div className="box2">
                                        <h2>Date</h2>
                                        <input type='date' placeholder='date ' name='date' value={values.date} onChange={handleChange} />
                                    </div>
                                    <div className="box2">
                                        <h2>time</h2>
                                        <input type='time' placeholder='Time ' name='time' value={values.time} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="btn1">
                                <button type='submit'>Submit</button>
                            </div>
                        </form>
                    </div>
                )}
                <div className="task-container">
                    <div className="text">
                        <h2>All Task</h2>
                    </div>
                <div className="categories">
                    <div className="cards">
                    {Array.isArray(data) && data.map((list,index) =>{
                        return <div key={index}>
                        <div className="card">
                            <div className="drawer">
                                <div className="content">
                                    <h3 className={list.complete === 'completed' ? 'completed' : ''}>{list.task}</h3>
                                    <p className={list.complete === 'completed' ? 'completed' : ''}>{list.description}</p>
                                <div className="date">
                                    <h3 className='d'>{list.date}</h3>
                                    <h3 className='t'>{list.time}</h3>
                                </div>
                            </div>
                           <div className="btn_com">
                                <button onClick={() => handleComplete(list.ID, list)} className={`button ${list.complete === 'completed' ? 'green' : ''}`}>
                                    {list.complete === 'completed' ? 'Completed' : ''}
                                </button>
                            </div>
                        </div>
                        <div className="add-btn">                  
                            <button className='edit' onClick={() => handleEdit(list)}><FaEdit /></button>
                            <button className='delete' onClick={()=>handleDelete(list.ID)}><FaTrash /></button>
                        </div>
                    </div>
                    </div>
                })}
            </div>
            </div> 
        </div>
            </div>
            :
            <div>{message}
                <h3>hi</h3>
            </div>
        }
    </div>
  )
}
export default Home