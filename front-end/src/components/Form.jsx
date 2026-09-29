import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Form = (props) => {
  const { register, handleSubmit } = useForm();
  const [isLoading, setLoading]=useState(false)
  const onSubmit = async (data) => {
    console.log(data);
    setLoading(x=>!x)
  }



  //if data present add them in input, otherwise null

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <label>Profile image <input {...register("profile.profile_image")} type="file" /></label>
      <label>Username <input {...register("username")} type="text" placeholder="Enter your Username" required/></label>
      <label>Email <input {...register("email")} type="email" placeholder="Enter your Email" /></label>
      <label>First Name <input {...register("first_name")} type="text" placeholder="Enter your First Name" /></label>
      <label>Last Name <input {...register("last_name")} type="text" placeholder="Enter your Last Name" /></label>
      <label>Phone <input {...register("profile.phone")} type="tel" placeholder="Enter your Phone" /></label>
      <label>Gender <select {...register("profile.gender")}>
        <option value="M">Male</option>
        <option value="F">Female</option>
      </select></label>
      <label>Date of Birth <input {...register("profile.date_of_birth")} type="date" /></label>
      <label>Job Title <input {...register("profile.job_title")} placeholder="Enter your Job Title" /></label>
      <label>Department <input {...register("profile.department")} placeholder="Enter your Department" /></label>
      <label>City <input {...register("profile.city")} placeholder="Enter your City" /></label>
      <label>Country <input {...register("profile.country")} placeholder="Enter your Country" /></label>
      <label>Bio <textarea {...register("profile.bio")} placeholder="Enter your Bio" /></label>
      <label>Hire Date <input {...register("profile.hire_date")} type="date" /></label>
      <label>
        Active<input {...register("profile.is_active")} type="checkbox" defaultChecked/> 
      </label>

      <button type="submit" disabled={isLoading}  >{props.SubmitText}</button>
    </div></form>
  );
};

export default Form;
