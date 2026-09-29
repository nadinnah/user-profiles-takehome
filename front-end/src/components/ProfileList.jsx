import React from "react";
import { Link } from "react-router-dom";

const dummy_profiles=[
    {
      id: 1,
      first_name: "Sarah",
      last_name: "Al-Sabah",
      username: "sarahs",
      email: "sarah@example.com",
      department: "Engineering",
      job_title: "Full Stack Developer",
      city: "Kuwait City",
      is_active: true,
      profile_image: null, // Test fallback avatar
    },
    {
      id: 2,
      first_name: "Ahmad",
      last_name: "Mansour",
      username: "ahmadm",
      email: "ahmad@example.com",
      department: "Product",
      job_title: "UI/UX Designer",
      city: "Hawally",
      is_active: true,
      profile_image: "https://i.pravatar.cc/150?u=ahmadm", // Test real image
    },
    {
      id: 3,
      first_name: "Fatimah",
      last_name: "Kandari",
      username: "fkandari",
      email: "fatimah@example.com",
      department: "HR",
      job_title: "HR Specialist",
      city: "Salmiya",
      is_active: false,
      profile_image: null,
    },
  ];

const ProfileList = ({ profiles = dummy_profiles }) => {

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ padding: "8px" }}>Photo</th>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Username</th>
            <th style={{ padding: "8px" }}>Email</th>
            <th style={{ padding: "8px" }}>Department</th>
            <th style={{ padding: "8px" }}>Job Title</th>
            <th style={{ padding: "8px" }}>City</th>
            <th style={{ padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>
                {p.profile_image ? (
                  <img
                    src={p.profile_image}
                    alt={p.username}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {p.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </td>
              <td style={{ padding: "8px" }}>{p.first_name} {p.last_name}</td>
              <td style={{ padding: "8px" }}>@{p.username}</td>
              <td style={{ padding: "8px" }}>{p.email}</td>
              <td style={{ padding: "8px" }}>{p.department}</td>
              <td style={{ padding: "8px" }}>{p.job_title}</td>
              <td style={{ padding: "8px" }}>{p.city}</td>
              <td style={{ padding: "8px" }}>{p.is_active ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileList;