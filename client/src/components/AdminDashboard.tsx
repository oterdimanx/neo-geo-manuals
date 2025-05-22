import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      fetch('/.netlify/functions/admin')
        .then(res => res.json())
        .then(setUsers);
    }, []);
  
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">User Subscriptions</h1>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>
                    <span className={`pill ${user.subscription_status}`}>
                      {user.subscription_status}
                    </span>
                  </td>
                  <td>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }