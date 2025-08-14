import React from "react";

const Product = () => {
  return (
    <div class="bg-slate-50 min-h-screen p-6 font-sans">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Inventory List</h1>
        <a
          href="add-item.html"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Item
        </a>
      </div>

      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-gray-600">Show 10 entries</span>
        <input
          type="text"
          placeholder="Search..."
          class="border border-gray-300 rounded-md px-3 py-1"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full bg-white shadow-md rounded-lg text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 text-left">#</th>
              <th class="p-2 text-left">Name</th>
              <th class="p-2 text-left">Category</th>
              <th class="p-2 text-left">Description</th>
              <th class="p-2 text-center">Quantity</th>
              <th class="p-2 text-right">Price</th>
              <th class="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-gray-50">
              <td class="p-2">1</td>
              <td class="p-2">Test Item</td>
              <td class="p-2">CategoryTest</td>
              <td class="p-2 max-w-xs truncate">asdasdasda</td>
              <td class="p-2 text-center">84</td>
              <td class="p-2 text-right">$23.00</td>
              <td class="p-2 flex gap-2 justify-center">
                <a
                  href="#"
                  class="text-xs bg-green-500 text-white px-2 py-1 rounded"
                >
                  Stock Entry
                </a>
                <a
                  href="#"
                  class="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Update
                </a>
                <a
                  href="#"
                  class="text-xs bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
