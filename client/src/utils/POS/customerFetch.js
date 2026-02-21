import axios from "axios";

export const customerFetch = async (query) => {
    try {
        const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/customer/pos`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          params: {
            q: query,
          },
        },
      );

      return data;
    } catch (error) {
        console.log("Something went wrong!");
    }
}