import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "../css/ProfileList.css";
import AxiosInstance from "../helper-api/axios";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ImportExportIcon from "@mui/icons-material/ImportExport";

const ProfileList = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [users, setUser] = useState([]);
  const fileRef = useRef(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    GetData();
  }, []);

  const GetData = () => {
    //to trigger it use useEffect
    AxiosInstance.get(`user/`).then((response) => {
      setUser(response.data);
    });
  };

  const handleFile = async (e) => {
  const file = e.target.files[0];
  e.target.value = "";                       // lets you pick the same file again
  if (!file) return;

  let rows;
  try {
    rows = JSON.parse(await file.text());
  } catch {
    setResult({ error: "That file is not valid JSON." });
    return;
  }
  if (!Array.isArray(rows)) {
    setResult({ error: "The JSON must be a list of users." });
    return;
  }

  try {
    const res = await AxiosInstance.post("user/import/", rows, {
      headers: { "Content-Type": "application/json" },
    });
    setResult(res.data);
    GetData();                               // refresh the table
  } catch (err) {
    setResult({ error: err.response?.data?.detail || "Import failed." });
  }
};

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "0 80px",
        }}
      >
        <Link to="/profiles/new" style={{ textDecoration: "none" }}>
          <button>
            <PersonAddAltIcon style={{ padding: "0 10 0 0" }} /> Create new
            User{" "}
          </button>
        </Link>
        <button onClick={() => fileRef.current.click()}>
  <ImportExportIcon style={{ padding: "0 5px 0 0" }} />Import Users
</button>
<input type="file" accept=".json,application/json" ref={fileRef} onChange={handleFile} style={{ display: "none" }} />
      </div>

      
        {result && (
          <div style={{ margin: "16px 80px" }}>
            {result.error ? (
              <p style={{ color: "red" }}>{result.error}</p>
            ) : (
              <>
                <p>
                  Imported {result.imported_count}. Failed {result.failed_count}
                  .
                </p>

                {result.imported_count > 0 && (
                  <ul>
                    {result.imported.map((u) => (
                      <li key={u.id}>
                        {u.first_name} {u.last_name} (@{u.username}) - {u.email}
                      </li>
                    ))}
                  </ul>
                )}

                {result.failed_count > 0 && (
                  <>
                    <h3>Could not import</h3>
                    <ul>
                      {result.failed.map((f) => (
                        <li key={f.row}>
                          Row {f.row}
                          {f.username ? ` (${f.username})` : ""}:{" "}
                          {JSON.stringify(f.errors)}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            <button onClick={() => setResult(null)}>Close</button>
          </div>
        )}
        <h1 style={{ display: "flex", justifyContent: "center" }}>
          Users' Profile Table
        </h1>
        <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #6c6a6a" }}>
              <th>Photo</th>
              <th>Name</th>
              <th>@Username</th>
              <th>Email</th>
              <th>Department</th>
              <th>Job Title</th>
              <th>City</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((p) => (
              <tr
                key={p.id}
                onClick={() => navigate(`/profiles/${p.id}`)}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td>
                  {p.profile?.profile_image ? (
                    <img
                      src={p.profile?.profile_image}
                      alt={p.username}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
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
                <td>
                  {p.first_name} {p.last_name}
                </td>
                <td>{p.username}</td>
                <td>{p.email}</td>
                <td>{p.profile?.department}</td>
                <td>{p.profile?.job_title}</td>
                <td>{p.profile?.city}</td>
                <td>{p.profile?.is_active ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProfileList;
