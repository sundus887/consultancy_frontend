import { useEffect, useState } from 'react';
import api from '../services/api';

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('buyers'); // 'buyers' or 'sellers'
  const [editingClient, setEditingClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Buyer form state
  const [buyerForm, setBuyerForm] = useState({
    companyName: "",
    buyerSTRN: "",
    buyerNTN: "",
    address: "",
    truckNo: "",
  });

  // Seller form state
  const [sellerForm, setSellerForm] = useState({
    companyName: "",
    sellerSTRN: "",
    sellerNTN: "",
    address: "",
    phone: "",
    email: "",
    posId: "",
    businessType: "",
  });

  // Fetch clients (buyers) from backend
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/clients');
      console.log('✅ Backend clients response:', response.data);
      setClients(response.data);
    } catch (err) {
      console.error('❌ Error fetching clients:', err);
      setError('Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sellers from backend
  const fetchSellers = async () => {
    try {
      const response = await api.get('/api/seller-settings');
      console.log('✅ Backend sellers response:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching sellers:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleBuyerChange = (e) => {
    setBuyerForm({ ...buyerForm, [e.target.name]: e.target.value });
  };

  const handleSellerChange = (e) => {
    setSellerForm({ ...sellerForm, [e.target.name]: e.target.value });
  };

  const handleAddBuyer = async (e) => {
    e.preventDefault();
    try {
      console.log('🔄 Submitting buyer data:', buyerForm);
      
      // Validate required fields
      if (!buyerForm.companyName || !buyerForm.buyerSTRN || !buyerForm.buyerNTN || !buyerForm.address) {
        setError('Please fill in all required fields (Company Name, STRN, NTN, Address)');
        return;
      }
      
      const response = await api.post('/api/clients', buyerForm);
      console.log('✅ Buyer added successfully:', response.data);
      
      setShowForm(false);
      setBuyerForm({
        companyName: "",
        buyerSTRN: "",
        buyerNTN: "",
        address: "",
        truckNo: "",
      });
       setError(null);
      await fetchClients();
    } catch (err) {
      console.error('❌ Error adding buyer:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to add buyer. Please try again.');
      }
    }
  };

  const handleAddSeller = async (e) => {
    e.preventDefault();
    try {
      console.log('🔄 Submitting seller data:', sellerForm);
      
      // Validate required fields
      if (!sellerForm.companyName || !sellerForm.sellerSTRN || !sellerForm.sellerNTN || !sellerForm.address) {
        setError('Please fill in all required fields (Company Name, STRN, NTN, Address)');
        return;
      }
      
      const response = await api.post('/api/seller-settings', sellerForm);
      console.log('✅ Seller added successfully:', response.data);
      
      setShowForm(false);
      setSellerForm({
        companyName: "",
        sellerSTRN: "",
        sellerNTN: "",
        address: "",
        phone: "",
        email: "",
        posId: "",
        businessType: "",
      });
      setError(null);
    } catch (err) {
      console.error('❌ Error adding seller:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to add seller. Please try again.');
      }
    }
  };

  const clearForm = () => {
    setBuyerForm({
      companyName: "",
      buyerSTRN: "",
      buyerNTN: "",
      address: "",
      truckNo: "",
    });
    setSellerForm({
      companyName: "",
      sellerSTRN: "",
      sellerNTN: "",
      address: "",
      phone: "",
      email: "",
      posId: "",
      businessType: "",
    });
    setError(null);
    setEditingClient(null);
    setIsEditing(false);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsEditing(true);
    setBuyerForm({
      companyName: client.companyName || "",
      buyerSTRN: client.buyerSTRN || "",
      buyerNTN: client.buyerNTN || "",
      address: client.address || "",
      truckNo: client.truckNo || "",
    });
    setShowForm(true);
  };

  const handleUpdateBuyer = async (e) => {
    e.preventDefault();
    try {
      console.log('🔄 Updating buyer data:', buyerForm);
      
      // Validate required fields
      if (!buyerForm.companyName || !buyerForm.buyerSTRN || !buyerForm.buyerNTN || !buyerForm.address) {
        setError('Please fill in all required fields (Company Name, STRN, NTN, Address)');
        return;
      }
      
      const response = await api.put(`/api/clients/${editingClient._id}`, buyerForm);
      console.log('✅ Buyer updated successfully:', response.data);
      
      setShowForm(false);
      setEditingClient(null);
      setIsEditing(false);
             setBuyerForm({
         companyName: "",
         buyerSTRN: "",
         buyerNTN: "",
         address: "",
         truckNo: "",
       });
       setError(null);
       await fetchClients(); // Refresh the list
    } catch (err) {
      console.error('❌ Error updating buyer:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update buyer. Please try again.');
      }
    }
  };

  const handleDeleteBuyer = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this buyer?')) {
      try {
        console.log('🗑️ Deleting buyer:', clientId);
        await api.delete(`/api/clients/${clientId}`);
        console.log('✅ Buyer deleted successfully');
        await fetchClients(); // Refresh the list
      } catch (err) {
        console.error('❌ Error deleting buyer:', err);
        setError('Failed to delete buyer. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading clients...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchClients}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Buyer Management</h2>
        <button
          className="bg-black text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Buyer
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Buyer' : 'Add New Buyer'}
          </h3>
          <form onSubmit={isEditing ? handleUpdateBuyer : handleAddBuyer}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
              <input 
                  type="text"
                name="companyName" 
                value={buyerForm.companyName} 
                onChange={handleBuyerChange} 
                  className="w-full border p-2 rounded"
                required 
              />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer STRN *
                </label>
              <input 
                  type="text"
                name="buyerSTRN" 
                value={buyerForm.buyerSTRN} 
                onChange={handleBuyerChange} 
                  className="w-full border p-2 rounded"
                required 
              />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer NTN *
                </label>
              <input 
                  type="text"
                name="buyerNTN" 
                value={buyerForm.buyerNTN} 
                onChange={handleBuyerChange} 
                  className="w-full border p-2 rounded"
                required 
              />
              </div>
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Address *
                 </label>
              <input 
                   type="text"
                name="address" 
                value={buyerForm.address} 
                onChange={handleBuyerChange} 
                   className="w-full border p-2 rounded"
                required 
              />
            </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Truck No
                 </label>
              <input 
                   type="text"
                   name="truckNo"
                   value={buyerForm.truckNo}
                   onChange={handleBuyerChange}
                   className="w-full border p-2 rounded"
                 />
               </div>
            </div>
          <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded"
              >
                {isEditing ? 'Update Buyer' : 'Add Buyer'}
            </button>
            <button 
              type="button" 
                onClick={() => {
                  setShowForm(false);
                  clearForm();
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Buyer List</h3>
        </div>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STRN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NTN
                </th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Address
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Truck No
                 </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {clients.length === 0 ? (
                  <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No buyers found
                    </td>
                  </tr>
                ) : (
                clients.map((client, index) => (
                  <tr key={client._id || client.id || index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.buyerSTRN}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.buyerNTN}
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                       {client.address}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                       {client.truckNo}
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditClient(client)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteBuyer(client._id || client.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

export default ClientsPage;