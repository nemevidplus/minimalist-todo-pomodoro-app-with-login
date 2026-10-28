import React, { useContext } from 'react'
import "./home.css"
import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import PomodoroTimer from './../../components/pomodoro/PomodoroTimer';
import axios from 'axios';
import Login from '../login/Login';
import Register from '../register/Register';
import Settings from '../settings/Settings';
import { Context } from '../../context/Context';

const publicItems = [
  {
    _id:'public-1',
    title: 'Üdv a kötelező to-do appomban 🎉',
    description: ' regisztráció után, saját feladataidat listázhatod ide',
    completed: false,
  },
  {
    _id:'public-2',
    title: 'Próbáld kia pomodoro időzítőt is',
    description: ' kattints bármelyik kártyára alul',
    completed: false,
  }
]


const Home = () => {

  const { user, dispatch } = useContext(Context);

  const [item, setItem] = useState({});
  const [items, setItems] = useState([]);
  const [activeItemId, setActiveItemId] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updatedItem, setUpdatedItem] = useState({});
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [authMode, setauthMode] = useState(null);




  useEffect(() => {
    const getItems = async()=> {
      try {
        // const response = await axios.get('/items');

        if (user && user._id) {
        const response = await axios.get(`https://minimalist-todo-pomodoro-app-backend.onrender.com/api/items?userId=${user._id}`);

        setItems(response.data);
      } else {
        setItems(publicItems);
      }
      }catch (error) {
        console.error(error);
      }
    };
    getItems();
  }, [user]);

  function staggerText(text) {
    return (
      <span className="stagger-word">
      {text.split('').map((char, index) => 
    (
    <span key={index}
    className="stagger-char"
    style={{ '--i': index}}
    >
    <span className="char-primary">{char === ' ' ? '\u00A0' : char}</span>
    <span className="char-hover">{char === ' ' ? '\u00A0' : char}</span>
    
    </span>
    ))}

      </span>
    );
  };

  function handleChange(event) {
    const {name, value} = event.target;
    setItem (prevItem => {
      return({...prevItem, [name]:value})
    })
    console.log(item)
  }
  function handleUpdateChange(event) {
    const {name, value} = event.target;
    setUpdatedItem (prevItem => {
      return({...prevItem, [name]:value})
    })
    console.log(item)
  }

  async function addItem(event) {
    event.preventDefault();

    if (!user) {
      alert("A saját teendők mentéséhez kérlek jelentkezz be!");
      setauthMode('login');
      return;
    }

    const newItem = {
      title: item.title,
      description: item.description, 
      completed: false,
      userId: user._id
    };

    try{  
      // const response= await axios.post('/newitem', newItem);
      const response = await axios.post('https://minimalist-todo-pomodoro-app-backend.onrender.com/api/items/newitem', newItem);
      console.log(response.data)
      setItem({title: "", description: ""})
      setItems(prevItems => [...prevItems, response.data])
    } catch (error) {
      console.error(error);
    }
  }
 
  async function deleteItem(id) {
    try {
      // const response = await axios.delete('/delete/' + id);
      const response = await axios.delete('https://minimalist-todo-pomodoro-app-backend.onrender.com/api/items/delete/' + id);
      console.log(response.data);
      setItems(prevItems => prevItems.filter(i=> id !== i._id))
    }catch (error) {
      console.error(error);
    }
  }
 
  function startUpdate(oldItem) {
    setOpenUpdate(true);
    setUpdatedItem({
      title: oldItem.title,
      description: oldItem.description,
      id: oldItem._id
    })
  }

  async function updateItem(id) {
    try {
      // const response = await axios.put('/update/' 
        const response = await axios.put('https://minimalist-todo-pomodoro-app-backend.onrender.com/api/items/update/'
        + id, {
        title: updatedItem.title,
        description: updatedItem.description,
        userId: user._id
      })
      console.log(response.data);
      setItems(prevItems=> prevItems.map(item=> item._id === id? response.data : item));
      setItem({title: "", description: ""})
      setOpenUpdate(false)
    } catch (error) {
      console.error(error);
    }
  }
async function cancelUpdate(id) {
  try {
    setOpenUpdate(false)
    setItem({title: "", description: ""})
  }catch (error) {
      console.error(error);
    }
}

async function toggleComplete(id, currentStatus) {
  try {
    // const response = await axios.put('/update/' 
    const response = await axios.put('https://minimalist-todo-pomodoro-app-backend.onrender.com/update/'
      + id, {
      completed: !currentStatus,
      userId: user._id
    });
    console.log(response.data);
    setItems(prevItems =>
      prevItems.map(item => item._id === id ? response.data : item)
    );
  } catch (error) {
    console.error(error);
  }
}

const filteredItems = items.filter((i) => {
  if (selectedTab === "IN_PROGRESS") return !Boolean(i.completed);
  if (selectedTab === "COMPLETED") return Boolean(i.completed) ;
  return true;
} );

const handleLogout =() => {
  dispatch ({type: "LOGOUT"});
};


  return (
    <div className="home-page">

<div className="sticky-home-header">
<Navbar/>
<div className="nav-bottom-wrapper">
  <nav className=" container nav-bottom">
  <div className="nav-group">
  <div 
    className={`nav-item ${selectedTab === 'ALL' ? 'selected-filter' : ''}`}
    onClick={() => setSelectedTab('ALL')}
    >{staggerText('ÖSSZES')} <span className="count">{items.length}</span>
  </div>
  <div 
  className={`nav-item ${selectedTab === 'IN_PROGRESS' ? 'selected-filter' : ''}`}
  onClick={() => setSelectedTab('IN_PROGRESS')}
  >{staggerText('FOLYAMATBAN')}<span className="count">{items.filter(i => i.completed !== true).length}</span></div>
  <div 
  className={`nav-item ${selectedTab === 'COMPLETED' ? 'selected-filter' : ''}`}
  onClick={() => setSelectedTab('COMPLETED')}
  >{staggerText('KÉSZ')} <span className="count">{items.filter( i=> i.completed ===true).length}</span></div>


  { user ? ( <>
    <div className="nav-item" onClick={() => setauthMode('settings')}>FELHASZNÁLÓ </div>
  <div className="nav-item" onClick= {handleLogout}>KIJELENTKEZÉS</div>
   </>
   ) : ( 
    <>
   <div className="nav-item" onClick={() => setauthMode('login')}>BEJELENTKEZÉS </div>
   <div className="nav-item" onClick={() => setauthMode('register')}>REGISZTRÁCIÓ </div>
  

   </>
  )
  }
  </div>
 
  </nav>
  </div>

 <div className="container">
      
    {!openUpdate ? (<>

      <form className="todo-form" onSubmit={addItem}>

      <input 
            className="form-input"
            value={item.title}
            name="title"
            onChange={handleChange}
            placeholder= "feladat címe" 
      />
      <input
            className="form-textarea"
            value={item.description}
            name="description"
            onChange={handleChange}
            placeholder= "feladat részletei"
            
      />
    <button className="form-btn" type="submit"> + ÚJ FELADAT</button>
    </form> </>) : (<>

<form className="todo-form update-form" onSubmit={(e) => { e.preventDefault(); updateItem(updatedItem.id); }}>

  <input value={updatedItem.title}
        name="title"
        className="form-input"
        onChange={handleUpdateChange}
        placeholder= "title" 
  />
  <input value={updatedItem.description}
        name="description"
        className="form-textarea"
        onChange={handleUpdateChange}
        placeholder= "description" 
  />
<button className="form-btn" onClick={() => updateItem(updatedItem.id)}>VÁLTOZTATÁSOK MENTÉSE</button>
<button className="form-btn btn-cancel" onClick={() => cancelUpdate(updatedItem.id)}>MÉGSE</button>
</form>

</>) }
  </div>
  </div>

    <main className="container main-content"> 

    {authMode === 'login' ? (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      <Login /> 
    </div>
  ) : authMode === 'register' ? (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      <Register /> 
    </div> 
  ) 
   : authMode === 'settings' ? (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      <Settings /> 
    </div> 
  ) 
  
  : (
    <div className="todo-grid">
    {filteredItems.map(item=> {
      return(
       <div key={item._id} className={`todo-card ${item.completed ? 'completed-item' : ''} ${
       activeItemId === item._id ? 'active' : ''} ` }
       onClick={() =>
       
       setActiveItemId(activeItemId === item._id? null : item._id)
       }
       >
       <h1 className="todo-title">{item.title}</h1>
       <h2 className="todo-desc">{item.description}</h2>
        
      <div className="todo-actions"> 

       <div className="pomodoro-wrapper">
      <PomodoroTimer />
      </div>
      
      <div className="action-buttons">
      <button className="btn-mini" onClick={(e) => {
        e.stopPropagation();
        toggleComplete(item._id, item.completed)}}>
        {item.completed ? 'VISSZAÁLLÍT' : 'KÉSZ'}
      </button>


       <button className="btn-mini" onClick={(e) => {
        e.stopPropagation();
        deleteItem(item._id)}}>TÖRÖL</button>
       <button className="btn-mini" onClick={(e)=> {
         e.stopPropagation();
         startUpdate(item)} }>MÓDOSÍT</button>
       </div>
       </div>
       </div>
      )
    }) }
    </div> 
  )}
    </main>


    
    

    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-group">
          <span className="footer-label">{"//"} KAPCSOLAT </span>
          <a href="mailto:nemevid@gmail.com" className="footer-email">
           nemevid@gmail.com
          </a>
        </div>

        <div className="footer-copy">
          © {new Date().getFullYear()} FELADATOK{"//"} DIGITÁLIS FELADATTÉR 🤍 do no harm
        </div>
      </div>
    </footer>

    </div>
  )
}

export default Home
