import {Routes, Route, useNavigate, useParams} from 'react-router'
import './App.css'
import AxiosInstance from "./helper-api/axios";
import ProfileList from './components/ProfileList'
import Form from './components/Form'
import ProfileDetails from './components/ProfileDetails'

function App() {
  const navigate= useNavigate();

  const handleUpdate = async (id, formData) => {
    await AxiosInstance.put(`user/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    navigate("/");
  };
  
  const handleCreateUser = async (formData) => {
  try {
    await AxiosInstance.post(`user/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    navigate("/");
  } catch (err) {
    console.log("Server said:", err.response?.data);
    throw err;
  }
};

  return (
    <>
    <Routes>
      <Route path="/" element={<ProfileList/>}/>
      <Route path="/profiles/new" element={<Form SubmitText="Create User" Title="Create New User" OnSubmit={handleCreateUser} isEdit={false}/>}/> 
      <Route path="/profiles/:id" element={<ProfileDetails/>}/>
      <Route path="/profiles/:id/edit" element={<Form SubmitText="Update" Title="Edit User Profile" OnSubmit={handleUpdate} isEdit={true}/>}/>
    </Routes>   
    </>
  )
}

export default App
