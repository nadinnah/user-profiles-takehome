import {Routes, Route} from 'react-router'
import './App.css'
import ProfileList from './components/ProfileList'
import Form from './components/Form'
import ProfileDetails from './components/ProfileDetails'

function App() {
  return (
    <>
    <Routes>
      <Route path="" element={<ProfileList/>}/>
      <Route path="/profiles/new" element={<Form SubmitText="Create New User"/>}/> //create
      <Route path="/profiles/:id" element={<ProfileDetails/>}/>
      <Route path="/profile/:id/edit" element={<Form SubmitText="Update"/>}/>
    </Routes>   
    </>
  )
}

export default App
