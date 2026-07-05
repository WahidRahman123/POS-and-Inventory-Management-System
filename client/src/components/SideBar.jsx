import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom";

const SideBar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleOnClick = () => {
    navigate("/changepassword");
    closeSidebar?.();
  };

  return (
    <div className="w-64 bg-gray-200 flex flex-col h-screen shadow-xl ">
      <div className="p-6 text-lg font-bold border-b border-gray-300">
        ELITE BATTERY
      </div>

      <nav className="flex flex-col mt-4 overflow-y-auto">
        <NavLink
          to="/"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
          }
        >
          <span className="mr-3">📊</span> Dashboard
        </NavLink>
        <NavLink
          to="/point-of-sale"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
          }
        >
          <span className="mr-3">📠</span> POS
        </NavLink>

        <NavLink
          to="/product"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
          }
        >
          <span className="mr-3">📦</span> Inventory
        </NavLink>
        <NavLink
          to="/product/add"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
          }
        >
          <span className="mr-3">➕</span> Add Item
        </NavLink>
        <NavLink
          to="/purchase"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
          }
        >
          <span className="mr-3">📅</span> Purchase
        </NavLink>
        <NavLink
            to="/product-exchange"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">📅</span> Product Exchange
          </NavLink>
        <NavLink
            to="/exchange-product-sell"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">📅</span> Exchange Product Sell
          </NavLink>
          <NavLink
            to="/company-return"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">📅</span> Exchange Return To Company
          </NavLink>
          <NavLink
            to="/company-sales-return"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">📅</span> Sales Return To Company
          </NavLink>

          {/* <NavLink
            to="/purchase-return"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">📅</span> Purchase Return
          </NavLink>
          <NavLink
            to="/purchase-return-statement"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">📅</span> Purchase Return Statement
          </NavLink> */}
          
          <NavLink
            to="/sales-return"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">📅</span> Sales Return
          </NavLink>
          {/* <NavLink
            to="/sales-return-statement"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">📅</span> Sales Return Statement
          </NavLink> */}

        {user?.role === "admin" && (
          <NavLink
            to="/sales-report"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">📅</span> Sales Report
          </NavLink>
          
        )}

        <NavLink
          to="/category"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
          }
        >
          <span className="mr-3">🏷️</span> Categories
        </NavLink>

        <NavLink
          to="/customer"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
          }
        >
          <span className="mr-3">👤</span> Customer
        </NavLink>
        {/* <NavLink to="/customer-statement" end onClick={closeSidebar} className={({ isActive }) =>
          `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
        }>
          <span className="mr-3">📅</span> Customer Statement 
        </NavLink> */}

        <NavLink
          to="/purchaser"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
          }
        >
          <span className="mr-3">👤</span> Supplier
        </NavLink>
        {/* <NavLink
          to="/purchaser-statement"
          end
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
          }
        >
          <span className="mr-3">📅</span> Supplier Statement
        </NavLink> */}
        <NavLink to="/expense-management" end onClick={closeSidebar} className={({ isActive }) =>
          `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
        }>
          <span className="mr-3">💸</span> Expense Management
        </NavLink>

        {user?.role === "admin" && (
          <NavLink
            to="/users"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-400 ${isActive ? "bg-gray-300 font-bold" : ""}`
            }
          >
            <span className="mr-3">👤</span> User Management
          </NavLink>
        )}
      </nav>

      <div className="flex justify-center mt-2 mb-5">
        <button
          onClick={handleOnClick}
          className="w-[60%] px-2 py-1 bg-blue-700 text-white rounded-lg hover:bg-blue-800 cursor-pointer"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default SideBar;
