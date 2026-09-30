import React, { useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import AxiosInstance from "../helper-api/axios";
import "../css/Form.css"
import {
  Button,
} from "@mui/material";

const Form = (props) => {
    const navigate= useNavigate();
  const { id } = useParams();
  const {register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      gender: 'male',
      date_of_birth: '',
      job_title: '',
      department: '',
      city: '',
      country: '',
      bio: '',
      hire_date: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (props.isEdit && id) {
      AxiosInstance.get(`user/${id}/`).then((response) => {
        const data = response.data;
        const p = data.profile || {};

        reset({
          username: data.username || '',
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: p.phone || '',
          gender: p.gender || 'male',
          date_of_birth: p.date_of_birth || '',
          job_title: p.job_title || '',
          department: p.department || '',
          city: p.city || '',
          country: p.country || '',
          bio: p.bio || '',
          hire_date: p.hire_date || '',
          is_active: p.is_active ?? true,
        });
      });
    }
  }, [props.isEdit, id, reset]);

  
  const onSubmit = async (data) => {
    try {
        const dataToSend = new FormData();
    
        dataToSend.append('username', data.username);
        dataToSend.append('email', data.email);
        dataToSend.append('first_name', data.first_name);
        dataToSend.append('last_name', data.last_name);
        dataToSend.append('profile.phone', data.phone || '');
        dataToSend.append('profile.gender', data.gender);
        dataToSend.append('profile.date_of_birth', data.date_of_birth);
        dataToSend.append('profile.job_title', data.job_title);
        dataToSend.append('profile.department', data.department);
        dataToSend.append('profile.city', data.city);
        dataToSend.append('profile.country', data.country);
        dataToSend.append('profile.bio', data.bio || '');
        dataToSend.append('profile.hire_date', data.hire_date);
        dataToSend.append('profile.is_active', data.is_active);
            
        const img = data.profile_image?.[0];
        if (img instanceof File) {
            dataToSend.append("profile.profile_image", img);
        }
        
        if(props.isEdit){
            await props.OnSubmit(id, dataToSend);
        }else{
            await props.OnSubmit(dataToSend);
        }
    } catch (error) {
        const emailError = error.response?.data?.email?.[0];
        const usernameError = error.response?.data?.username?.[0];
        if (usernameError) setError("username", { type: "server", message: usernameError });
        if (emailError) {
            setError("email", { type: "server", message: emailError });
        }else
        console.error("Form submission error:", error);
    }
  };


  //if data present add them in input, otherwise null

  return (
    <div style={{display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        }}>
            
    <form onSubmit={handleSubmit(onSubmit)}>
        <h2 style={{display: "flex",
            justifyContent: "center",
            alignItems: "center",}}>{props.Title}</h2>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" ,padding:'20px',boxSizing: "border-box",
            backgroundColor: "#fff1f0"}}>

        <label htmlFor="profile_image">
        Profile image
        <input id="profile_image" {...register("profile_image")} type="file" />
        </label>

        <label htmlFor="username">
        Username
        <input id="username" {...register("username", { required: 'Username is required' })} type="text" placeholder="Enter your Username" />
       </label>
        {errors.username && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.username.message}</p>}
        

        <label htmlFor="email">
        Email
        <input id="email" {...register("email", { required: 'Email is required' })} type="email" placeholder="Enter your Email" />
        </label> 
        {errors.email && <p style={{ color: 'red', margin: '4px 0 0' }}>{errors.email.message}</p>}
        
        <label htmlFor="first_name">
        First Name
        <input id="first_name" {...register("first_name")} type="text" placeholder="Enter your First Name" />
        </label>

        <label htmlFor="last_name">
        Last Name
        <input id="last_name" {...register("last_name")} type="text" placeholder="Enter your Last Name" />
        </label>

        <label htmlFor="phone">
        Phone
        <input id="phone" {...register("phone")} type="tel" placeholder="Enter your Phone" />
        </label>

        <label htmlFor="gender">
        Gender
        <select id="gender" {...register("gender", {required: true })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        </label>

        <label htmlFor="date_of_birth">
        Date of Birth
        <input id="date_of_birth" {...register("date_of_birth", { required: 'Date of birth is required' })} type="date" />
        </label>
        {errors.date_of_birth && <p style={{ color: 'red', margin: 0 }}>{errors.date_of_birth.message}</p>}

        <label htmlFor="job_title">
        Job Title
        <input id="job_title" {...register("job_title", { required: 'Job title is required' })} placeholder="Enter your Job Title" />
        </label>

        <label htmlFor="department">
        Department
        <input id="department" {...register("department", { required: 'Department is required' })} placeholder="Enter your Department" />
        </label>

        <label htmlFor="city">
        City
        <input id="city" {...register("city" , { required: 'City is required' })} placeholder="Enter your City" />
        </label>

        <label htmlFor="country">
        Country
        <input id="country" {...register("country", { required: 'Country is required' })} placeholder="Enter your Country" />
        </label>

        <label htmlFor="bio" style={{ display: "flex", alignItems: "flex-start" }}>
        Bio
        <textarea id="bio" {...register("bio")} placeholder="Enter your Bio" />
        </label>

        <label htmlFor="hire_date">
        Hire Date
        <input id="hire_date" {...register("hire_date", { required: 'Hire date is required' })} type="date" />
        </label>
        {errors.hire_date && <p style={{ color: 'red', margin: 0 }}>{errors.hire_date.message}</p>}

        <label htmlFor="is_active">
        Active
        <input id="is_active" {...register("is_active")} type="checkbox" />
        </label>
        </div>
        <div style={{display: "flex",justifyContent: "space-between",}}><Button variant="outlined" style={{display: "flex", borderRadius: "30px",padding: "10px", outlineColor:"", alignItems: "center",
   margin: "20px 0"}} onClick={() => navigate("/")}>Back</Button><button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : props.SubmitText}</button>
    </div>
      </form>
    </div>
  );
};

export default Form;

//touched (field interacted with?)and dirty(field value changed?)