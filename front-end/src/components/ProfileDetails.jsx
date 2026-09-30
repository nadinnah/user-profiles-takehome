import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import '../css/ProfileDetails.css';
import AxiosInstance from "../helper-api/axios";

const Row = ({ label, value }) => (
  <div style={{ display: "flex", padding: "16px 0", fontSize: 26,borderBottom: "1px solid #eee" }}>
    <strong style={{ fontSize: 26, width: "860px" }}>{label}</strong>
    <span>{value || "-"}</span>
  </div>
);

const ProfileDetails=()=>{
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        AxiosInstance.get(`user/${id}/`)
        .then((res) => setUser(res.data))
        .catch((err) => {
            if (err.response?.status === 404)
                setError("404 - Profile not found.");       
        else setError("Could not load this user.")})
        .finally(() => setLoading(false));
    }, [id]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
        await AxiosInstance.delete(`user/${id}/`);
        navigate("/");
        } catch (err) {
        console.error("Delete failed:", err);
        setError("Delete failed. Please try again.");
        setConfirmOpen(false);
        setDeleting(false);
        }
    };

    if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
    if (error && !user) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    if (!user) return null;

    const p = user.profile || {};
    const image = p.profile_image || user.profile_image;


    return( 
         
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" ,padding:'20px',boxSizing: "border-box",
            backgroundColor: "#fff1f0", padding:"50px 70px"}}>
    <div style={{ padding: "0 20px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        {image ? (
          <img
            src={image}
            alt={user.username}
            style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 96, height: 96, borderRadius: "50%", backgroundColor: "#ddd",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, fontWeight: "bold",
            }}
          >
            {user.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <h2 style={{ margin: 0 , fontSize: 36,}}>{user.first_name} {user.last_name}</h2>
        <span style={{ color: "#777" ,fontSize: 26,}}>@{user.username}</span>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div style={{ marginTop: 24, padding:"0px 100px" }}>
        <Row label="Email" value={user.email} />
        <Row label="Phone" value={p.phone} />
        <Row label="Gender" value={p.gender === "male" ? "Male" : p.gender === "female" ? "Female" : ""} />
        <Row label="Date of birth" value={p.date_of_birth} />
        <Row label="Job title" value={p.job_title} />
        <Row label="Department" value={p.department} />
        <Row label="City" value={p.city} />
        <Row label="Country" value={p.country} />
        <Row label="Hire date" value={p.hire_date} />
        <Row label="Status" value={p.is_active ? "Active" : "Inactive"} />
        <Row label="Bio" value={p.bio} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <Button variant="outlined" style={{display: "flex", fontSize: 26, borderRadius: "30px",padding: "10px 20px", outlineColor:"", alignItems: "center",
   margin: "20px 0"}} onClick={() => navigate("/")}>Back</Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button className="edit" style={{fontSize: 26, padding: "10px 20px"}} variant="contained" onClick={() => navigate(`/profiles/${id}/edit`)}>
            Edit
          </Button>
          <Button className="delete" style={{fontSize: 26, padding: "10px 20px"}} variant="contained" color="error" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)}>
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete <strong>{user.username}</strong>. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="edit" onClick={() => setConfirmOpen(false)} disabled={deleting}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div></div>)
}
 
export default ProfileDetails