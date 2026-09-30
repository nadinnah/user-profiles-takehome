import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "../css/ProfileList.css";
import AxiosInstance from "../helper-api/axios";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ImportExportIcon from "@mui/icons-material/ImportExport";

const PAGE_SIZE = 5;
const MEDIA_BASE = "http://127.0.0.1:8000";

const imageUrl = (path) =>
  !path ? null : path.startsWith("http") ? path : `${MEDIA_BASE}${path}`;

const ProfileList = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [result, setResult] = useState(null);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    AxiosInstance.get("user/", {
      params: { page, search: search || undefined },
      signal: controller.signal,
    })
      .then((res) => {
        setUsers(res.data.results);
        setCount(res.data.count);
      })
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        if (err.response?.status === 404 && page > 1) setPage(page - 1);
        else setError("Failed to load users.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page, search, refreshKey]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
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
      setRefreshKey((k) => k + 1);
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
          <ImportExportIcon style={{ padding: "0 5px 0 0" }} />
          Import Users
        </button>
        <input
          type="file"
          accept=".json,application/json"
          ref={fileRef}
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>

      {result && (
        <div style={{ margin: "16px 80px" }}>
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <>
              <p>
                Imported {result.imported_count}. Failed {result.failed_count}.
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
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, username, or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            flex: 1,
            maxWidth: "500px",
            borderRadius: "35px",
            padding: 10,
            marginRight: 10,
          }}
        />
        <button style={{
            marginRight: 10,
          }} type="submit">Search</button>

        {(search || searchInput) && (
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        )}
      </form>
      {error && <p style={{ color: "red", margin: "0 80px" }}>{error}</p>}

      <div style={{ overflowX: "auto", opacity: loading ? 0.6 : 1 }}>
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
            {users.map((p) => {
              const img = imageUrl(p.profile?.profile_image);
              return (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/profiles/${p.id}`)}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td>
                    {img ? (
                      <img
                        src={img}
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
              );
            })}
            {!loading && users.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          margin: "16px 0",
        }}
      >
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages} ({count} users)
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages || loading}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default ProfileList;
