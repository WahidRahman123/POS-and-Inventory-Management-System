import React, { useState } from 'react';

const ProductExchange = () => {
  const [formData, setFormData] = useState({
    supplierName: '',
    address: '',
    date: '',
    memo: '',
    productsName: '',
    quantity: '',
    qtyInKg: '',
    totalAmount: '',
    paid: ''
  });

  const [exchanges, setExchanges] = useState([
    {
      id: 1,
      date: '15-02-2026',
      memo: '1290',
      supplier: 'LED',
      products: 'Doewdo',
      qty: 10,
      qtyInKg: 5,
      total: 100000,
      paid: 100000,
      due: 0
    },
    {
      id: 2,
      date: '31-08-2025',
      memo: 'Memo-1',
      supplier: 'ABC',
      products: 'Nissan Battery',
      qty: 50,
      qtyInKg: 25,
      total: 100000,
      paid: 70000,
      due: 30000
    }
  ]);

  const [searchSupplier, setSearchSupplier] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExchange = (e) => {
    e.preventDefault();
    const total = parseFloat(formData.totalAmount) || 0;
    const paid = parseFloat(formData.paid) || 0;
    const due = total - paid;

    const newExchange = {
      id: exchanges.length + 1,
      date: formData.date || new Date().toLocaleDateString('en-GB'),
      memo: formData.memo,
      supplier: formData.supplierName,
      products: formData.productsName,
      qty: parseInt(formData.quantity) || 0,
      qtyInKg: parseFloat(formData.qtyInKg) || 0,
      total: total,
      paid: paid,
      due: due
    };

    setExchanges([newExchange, ...exchanges]);
    setFormData({
      supplierName: '',
      address: '',
      date: '',
      memo: '',
      productsName: '',
      quantity: '',
      qtyInKg: '',
      totalAmount: '',
      paid: ''
    });
  };

  const handleFilter = () => {
    // Filter logic here
    console.log('Filtering by:', searchSupplier, searchDate);
  };

  const handleClear = () => {
    setSearchSupplier('');
    setSearchDate('');
  };

  const handleAddPayment = (id) => {
    console.log('Add payment for id:', id);
  };

  const handlePrint = (id) => {
    console.log('Print exchange id:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Product Exchange</h1>

      {/* Exchange Entry Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-6xl mx-auto">
        <form onSubmit={handleAddExchange}>
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Customer Name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-red-300 text-white rounded-md hover:bg-red-400 transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="dd-----yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                name="memo"
                value={formData.memo}
                onChange={handleInputChange}
                placeholder="Memo"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                name="productsName"
                value={formData.productsName}
                onChange={handleInputChange}
                placeholder="Products Name (comma s"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Third Row - Added Qty in kg field */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <input
                type="number"
                name="qtyInKg"
                value={formData.qtyInKg}
                onChange={handleInputChange}
                placeholder="Qty in kg"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="Unit Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                placeholder="Total Amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                name="paid"
                value={formData.paid}
                onChange={handleInputChange}
                placeholder="Paid"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Exchange
          </button>
        </form>
      </div>

      {/* Exchange Report Section */}
      <div className="bg-white rounded-lg shadow-md p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Exchange Report</h2>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Search by Customer Name:</label>
              <input
                type="text"
                value={searchSupplier}
                onChange={(e) => setSearchSupplier(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Search by Date:</label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                placeholder="dd-----yyyy"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFilter}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Filter
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Memo</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Products</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Qty</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Qty (kg)</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Unit Price</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Total</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Paid</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Due</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((exchange) => (
                <tr key={exchange.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{exchange.date}</td>
                  <td className="border border-gray-300 px-4 py-3">{exchange.memo}</td>
                  <td className="border border-gray-300 px-4 py-3">{exchange.supplier}</td>
                  <td className="border border-gray-300 px-4 py-3">{exchange.products}</td>
                  <td className="border border-gray-300 px-4 py-3">{exchange.qty}</td>
                  <td className="border border-gray-300 px-4 py-3">{exchange.qtyInKg}</td>
                  <td className="border border-gray-300 px-4 py-3">{exchange.total.toLocaleString()}</td>
                  <td className="border border-gray-300 px-4 py-3">{exchange.paid.toLocaleString()}</td>
                  <td className={`border border-gray-300 px-4 py-3 font-semibold ${exchange.due > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {exchange.due.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddPayment(exchange.id)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                      >
                        Add Payment
                      </button>
                      <button
                        onClick={() => handlePrint(exchange.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50">
            Prev
          </button>
          <span className="text-gray-700">Page 1 of 1</span>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductExchange;