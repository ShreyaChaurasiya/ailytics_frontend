import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import logo from "./assets/logo.png";

// ✅ CHANGE HERE (IMPORTANT)
const BASE_URL = "https://ailytics-backend.onrender.com";

function App() {

  const [sum, setSum] = useState(0);
  const [data, setData] = useState([]);

  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Get total sales
  useEffect(() => {
    axios.get(`${BASE_URL}/api/sum?column=SALES`)
      .then(res => setSum(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🔹 Get grouped data
  useEffect(() => {
    axios.get(`${BASE_URL}/api/group?groupBy=COUNTRY&value=SALES`)
      .then(res => {
        const formatted = Object.keys(res.data).map(key => ({
          name: key,
          value: res.data[key]
        }));
        setData(formatted);
      })
      .catch(err => console.log(err));
  }, []);

  // 🔹 AI Ask
  const askAI = () => {
    if (!query) return;

    setLoading(true);

    axios.get(`${BASE_URL}/api/ai/ask?query=${encodeURIComponent(query)}`)
      .then(res => {
        const newMessages = [
          ...messages,
          { type: "user", text: query },
          { type: "ai", text: res.data }
        ];

        setMessages(newMessages);
        setQuery("");
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>

      <img
        src={logo}
        alt="AIlytics Logo"
        style={{ width: "200px", marginBottom: "20px" }}
      />

      <h1>AIlytics Dashboard</h1>
      <p style={{ color: "gray" }}>Turning Data Into WOW 🚀</p>

      <h2>Total Sales: {Number(sum).toFixed(2)}</h2>

      <h3>Sales by Country</h3>

      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>

      <h3>Data Table</h3>

      <table border="1" style={{ margin: "20px auto", padding: "10px" }}>
        <thead>
          <tr>
            <th>Country</th>
            <th>Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{Number(item.value).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 AI SECTION */}
      <h3>Ask AI 🤖</h3>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about your data..."
        style={{ padding: "10px", width: "300px" }}
      />

      <button
        onClick={askAI}
        style={{ marginLeft: "10px", padding: "10px" }}
      >
        Ask
      </button>

      {/* 🔥 CHAT BOX */}
      <div style={{
        width: "400px",
        margin: "20px auto",
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "10px",
        height: "300px",
        overflowY: "auto"
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            textAlign: msg.type === "user" ? "right" : "left",
            margin: "10px"
          }}>
            <span style={{
              display: "inline-block",
              padding: "10px",
              borderRadius: "10px",
              background: msg.type === "user" ? "#007bff" : "#f1f1f1",
              color: msg.type === "user" ? "white" : "black"
            }}>
              {msg.text}
            </span>
          </div>
        ))}

        {loading && <p>Thinking...</p>}
      </div>

    </div>
  );
}

export default App;